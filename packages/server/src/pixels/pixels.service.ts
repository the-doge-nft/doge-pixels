import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Events, PixelMintOrBurnPayload } from '../events';
import {BigNumber, ethers} from 'ethers';
import { EthersService } from '../ethers/ethers.service';
import * as ABI from '../contracts/hardhat_contracts.json';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../config/configuration';
import { PixelsRepository } from './pixels.repository';
import * as KobosuJson from '../constants/kobosu.json';
import { InjectSentry, SentryService } from '@travelerdev/nestjs-sentry';
import {Event} from "@ethersproject/contracts/src.ts/index";
import {keccak256} from "ethers/lib/utils";

@Injectable()
export class PixelsService implements OnModuleInit {
  private readonly logger = new Logger(PixelsService.name);
  private pxContract: ethers.Contract;
  private dogContract: ethers.Contract;

  public imageWidth = 640;
  public imageHeight = 480;
  private pixelToIDOffset = 1000000;

  constructor(
    private ethersService: EthersService,
    private configService: ConfigService<Configuration>,
    private pixelsRepository: PixelsRepository,
    private eventEmitter: EventEmitter2,
    @InjectSentry() private readonly sentryClient: SentryService,
  ) {}

  async onModuleInit() {
    await this.pixelsRepository.dropAllTransfers()
    if (!this.isConnectedToContracts && this.ethersService.provider) {
      this.onProviderConnected(this.ethersService.provider);
    }
  }

  @OnEvent(Events.ETHERS_WS_PROVIDER_CONNECTED)
  async handleProviderConnected(provider: ethers.providers.WebSocketProvider) {
    this.onProviderConnected(provider);
  }

  private get isConnectedToContracts() {
    return this.pxContract!! && this.dogContract!!
  }

  private async onProviderConnected(provider: ethers.providers.WebSocketProvider) {
    const logMessage = 'Provider connected';
    this.logger.log(logMessage);
    this.sentryClient.instance().captureMessage(logMessage);

    await this.connectToContracts(provider);
    this.initPixelListener();
    // this.syncTransfers();
    await this.syncRecentTransfers()
  }

  private async connectToContracts(
      provider: ethers.providers.WebSocketProvider,
  ) {
    const { chainId } = await provider.getNetwork();
    const pxContractInfo =
        ABI[chainId][this.ethersService.network].contracts['PX'];

    const dogContractInfo =
        ABI[chainId][this.ethersService.network].contracts['DOG20'];

    this.pxContract = new ethers.Contract(
        pxContractInfo.address,
        pxContractInfo.abi,
        provider,
    );

    this.dogContract = new ethers.Contract(
        dogContractInfo.address,
        dogContractInfo.abi,
        provider,
    );
  }

  private initPixelListener() {
    this.logger.log(`Listening to transfer events`);
    this.pxContract.on('Transfer', async (from, to, tokenId, event) => {
      this.logger.log(`new transfer event hit: (${tokenId.toNumber()}) ${from} -> ${to}`);
      const payload: PixelMintOrBurnPayload = {
        from,
        to,
        tokenId: tokenId.toNumber(),
        blockNumber: event.blockNumber
      };
      this.eventEmitter.emit(Events.PIXEL_MINT_OR_BURN, payload);

      await this.pixelsRepository.create({
        tokenId: tokenId.toNumber(),
        from,
        to,
        blockNumber: event.blockNumber,
        uniqueTransferId: this.getUniqueTransferId(event)
      });
    });
  }

  private async syncRecentTransfers() {
    this.logger.log('Syncing recent transfers')
    const mostRecentBlock = (await this.pixelsRepository.getMostRecentTransferByBlockNumber())[0]?.blockNumber
    this.logger.log(mostRecentBlock)
    if (!mostRecentBlock) {
      return this.syncAllTransferEvents()
    } else {
      return this.syncTransferEventsFromBlock(mostRecentBlock)
    }
  }

  async syncAllTransferEvents() {
    this.logger.log('Syncing all transfer events')
    return this.upsertTransfersFromLogs(await this.getAllPixelTransferLogs())
  }

  async syncTransferEventsFromBlock(blockNumber: number) {

  }

  private async upsertTransfersFromLogs(events: Event[]) {
    for (const event of events) {
      const { args, blockNumber } = event;
      const { from, to, tokenId } = args;
      await this.pixelsRepository.upsertPixelTransfer({
        tokenId: tokenId.toNumber(),
        from,
        to: to,
        blockNumber: blockNumber,
        uniqueTransferId: this.getUniqueTransferId(event)
      });
    }
  }

  private getUniqueTransferId(event: Event) {
    // https://ethereum.stackexchange.com/questions/55155/contract-event-transactionindex-and-logindex
    const { blockHash, transactionHash, logIndex } = event
    return `${blockHash}:${transactionHash}:${logIndex}`
  }

  async getAllPixelTransferLogs() {
    this.logger.log('Getting all pixel transfer events')
    const filter = this.pxContract.filters.Transfer(null, null);
    const fromBlock = this.configService.get(
      'pixelContractDeploymentBlockNumber',
    );
    const toBlock = await this.ethersService.provider.getBlockNumber();

    const logs = [];
    const step = 5000;
    for (let i = fromBlock; i <= toBlock; i += step + 1) {
      const _logs = await this.pxContract.queryFilter(filter, i, i + step);
      logs.push(..._logs);
    }
    return logs;
  }

  getDogLocked() {
    return this.dogContract.balanceOf(this.pxContract.address);
  }

  getContractAddresses() {
    return {
      dog: this.dogContract.address,
      pixel: this.pxContract.address,
    };
  }

  getPixelURI(tokenId: string) {
    return this.pxContract.tokenURI(tokenId);
  }

  async getDimensions() {
    const width = await this.pxContract.SHIBA_WIDTH();
    const height = await this.pxContract.SHIBA_HEIGHT();
    return {
      width: width.toNumber(),
      height: height.toNumber(),
    };
  }

  async getPixelOwner(tokenId: number) {
    return this.pxContract.ownerOf(tokenId);
  }

  getPixelBalanceByAddress(address: string) {
    return this.pxContract.balanceOf(address);
  }

  pixelToIndexLocal(pixel: number) {
    return pixel - this.pixelToIDOffset;
  }

  pixelToCoordsLocal(pixel: number) {
    const index = this.pixelToIndexLocal(pixel);
    return [index % this.imageWidth, Math.floor(index / this.imageWidth)];
  }

  pixelToHexLocal(pixel: number) {
    const [x, y] = this.pixelToCoordsLocal(pixel);
    return KobosuJson[y][x];
  }

  async getTranserEvents(
    {filter, sort}:
    {
      filter?: {
        tokenId?: number,
        from?: string,
        to?: string,
        fromBlockNumber?: number,
        toBlockNumber?: number,
        fromDate?: string,
        toDate?: string
      },
      sort?: {
        tokenId?: 'ASC' | 'DESC',
        blockNumber?: 'ASC' | 'DESC',
        insertedAt?: 'ASC' | 'DESC',
      }
    }
  ) {
      return this.pixelsRepository.getPixelTransfers(filter, sort)
  }



}
