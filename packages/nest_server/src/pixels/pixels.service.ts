import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Events } from '../events';
import { ethers } from 'ethers';
import { EthersService } from '../ethers/ethers.service';
import * as ABI from '../contracts/hardhat_contracts.json';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../config/configuration';
import { PixelsRepository } from './pixels.repository';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';

@Injectable()
export class PixelsService implements OnModuleInit {
  private readonly logger = new Logger(PixelsService.name);
  private pxContract: ethers.Contract;
  private dogContract: ethers.Contract;

  constructor(
    private ethersService: EthersService,
    private configService: ConfigService<Configuration>,
    private pixelsRepository: PixelsRepository,
    @InjectSentry() private readonly sentryClient: SentryService,
  ) {}

  async onModuleInit() {
    this.logger.log(`PIXELS SERVICE INIT`)
    if (!this.pxContract && !this.dogContract && this.ethersService.provider) {
      this.initContracts(this.ethersService.provider);
    }
  }

  @OnEvent(Events.ETHERS_WS_PROVIDER_CONNECTED)
  async handleProviderConnected(provider: ethers.providers.WebSocketProvider) {
    const logMessage = 'Infura provider re-connected';
    this.logger.log(logMessage);
    this.sentryClient.instance().captureMessage(logMessage);
    this.initContracts(provider);
  }

  private async initContracts(provider: ethers.providers.WebSocketProvider) {
    await this.connectToContracts(provider);
    this.initPixelListener();
    this.syncTransfers();
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
    this.pxContract.on('Transfer', async (from, to, tokenId, event) => {
      this.logger.log(`new transfer event hit: ${from} -- ${to} -- ${tokenId}`);
      this.pixelsRepository.updateOwner({ tokenId, ownerAddress: to });
    });
  }

  async syncTransfers() {
    const logs = await this.getAllPixelTransferLogs();

    for (const log of logs) {
      const { transactionHash: txHash, args } = log;
      const { from, to, tokenId } = args;

      const pixel = await this.pixelsRepository.findByTokenId(
        tokenId.toNumber(),
      );
      if (!pixel) {
        await this.pixelsRepository.create({
          from,
          to,
          tokenId: tokenId.toNumber(),
        });
      } else {
        await this.pixelsRepository.updateOwner({
          tokenId: tokenId.toNumber(),
          ownerAddress: to,
        });
      }
    }
  }

  async getAllPixelTransferLogs() {
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
      widht: width.toNumber(),
      height: height.toNumber(),
    };
  }

  getPixelBalanceByAddress(address: string) {
    return this.pxContract.balanceOf(address);
  }
}
