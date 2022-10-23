import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Events, PixelTransferEventPayload } from '../events';
import { ethers } from 'ethers';
import { EthersService } from '../ethers/ethers.service';
import * as ABI from '../contracts/hardhat_contracts.json';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../config/configuration';
import * as KobosuJson from '../constants/kobosu.json';
import { InjectSentry, SentryService } from '@travelerdev/nestjs-sentry';
import { PixelTransferService } from '../pixel-transfer/pixel-transfer.service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class OwnTheDogeContractService implements OnModuleInit {
  private readonly logger = new Logger(OwnTheDogeContractService.name);
  private pxContract: ethers.Contract;
  private dogContract: ethers.Contract;

  public imageWidth = 640;
  public imageHeight = 480;
  private pixelToIDOffset = 1000000;

  constructor(
    @Inject(forwardRef(() => PixelTransferService))
    private pixelTransferService: PixelTransferService,
    private ethersService: EthersService,
    private configService: ConfigService<Configuration>,
    private eventEmitter: EventEmitter2,
    private http: HttpService,
    @InjectSentry() private readonly sentryClient: SentryService,
  ) {}

  async onModuleInit() {
    if (!this.isConnectedToContracts && this.ethersService.provider) {
      this.onProviderConnected(this.ethersService.provider);
    }
  }

  @OnEvent(Events.ETHERS_WS_PROVIDER_CONNECTED)
  async handleProviderConnected(provider: ethers.providers.WebSocketProvider) {
    this.onProviderConnected(provider);
  }

  private get isConnectedToContracts() {
    return this.pxContract!! && this.dogContract!!;
  }

  private async onProviderConnected(
    provider: ethers.providers.WebSocketProvider,
  ) {
    const logMessage = 'Provider connected';
    this.logger.log(logMessage);
    this.sentryClient.instance().captureMessage(logMessage);

    await this.connectToContracts(provider);
    this.initPixelListener();
    await this.pixelTransferService.syncRecentTransfers();
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
    this.logger.log(`Listening to pixel transfer events`);
    this.pxContract.on('Transfer', async (from, to, tokenId, event) => {
      this.logger.log(
        `new transfer event hit: (${tokenId.toNumber()}) ${from} -> ${to}`,
      );
      const blockNumber = event.blockNumber;
      const blockCreatedAt =
        await this.ethersService.getDateTimeFromBlockNumber(blockNumber);
      const payload: PixelTransferEventPayload = {
        from,
        to,
        tokenId: tokenId.toNumber(),
        blockNumber,
        blockCreatedAt,
        event: event,
      };
      this.eventEmitter.emit(Events.PIXEL_TRANSFER, payload);
    });
  }

  async getAllPixelTransferLogs() {
    const from = this.configService.get('pixelContractDeploymentBlockNumber');
    return this.getPixelTransferLogs(from);
  }

  async getPixelTransferLogs(fromBlock: number, _toBlock?: number) {
    // get logs from the chain chunked by 5k blocks
    // infura will only return 10k logs per request
    const toBlock = _toBlock
      ? _toBlock
      : await this.ethersService.provider.getBlockNumber();
    this.logger.log(
      `Getting pixel transfers from block: ${fromBlock} to block: ${toBlock}`,
    );
    const logs = [];
    const step = 5000;
    const filter = this.pxContract.filters.Transfer(null, null);
    for (let i = fromBlock; i <= toBlock; i += step + 1) {
      const _logs = await this.pxContract.queryFilter(filter, i, i + step);
      logs.push(..._logs);
    }
    this.logger.log(`Got pixel transfer logs of length: ${logs.length}`);
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

  async getTokenMetadata(tokenId: string) {
    // todo instead of querying the contract -- query the DB first to ensure the token has been minted actually
    const uri = await this.getPixelURI(tokenId);
    return this.http.get(uri).toPromise();
  }
}
