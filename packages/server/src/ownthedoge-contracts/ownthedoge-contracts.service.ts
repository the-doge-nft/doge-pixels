import { Provider } from '@ethersproject/providers';
import { HttpService } from '@nestjs/axios';
import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { TokenType } from '@prisma/client';
import { ethers, Signer } from 'ethers';
import { Configuration } from '../config/configuration';
import * as KobosuJson from '../constants/kobosu.json';
import * as ABI from '../contracts/hardhat_contracts.json';
import { CurrencyService } from '../currency/currency.service';
import { EthersService } from '../ethers/ethers.service';
import { Events, PixelTransferEventPayload } from '../events';
import { sleep } from '../helpers/sleep';
import { PixelTransferService } from '../pixel-transfer/pixel-transfer.service';

@Injectable()
export class OwnTheDogeContractService implements OnModuleInit {
  private readonly logger = new Logger(OwnTheDogeContractService.name);
  private pxContract: ethers.Contract;
  private dogContract: ethers.Contract;
  private dripDogSigner: ethers.Wallet;

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
    private currency: CurrencyService,
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

  get isConnectedToContracts() {
    return !!this.pxContract && !!this.dogContract;
  }

  private async onProviderConnected(
    provider: ethers.providers.WebSocketProvider,
  ) {
    const logMessage = 'Provider connected';
    this.logger.log(logMessage);

    this.dripDogSigner = new ethers.Wallet(
      this.configService.get('dripKey'),
      provider,
    );

    await this.connectToContracts(provider);
    this.initPixelListener();
    await this.pixelTransferService.syncRecentTransfers();
    await this.upsertDogCurrency();
  }

  private async upsertDogCurrency() {
    const symbol = await this.dogContract.symbol();
    const name = await this.dogContract.name();
    const decimals = await this.dogContract.decimals();
    const { dog: contractAddress } = this.getContractAddresses();

    await this.currency.upsert({
      where: {
        contractAddress,
      },
      create: {
        contractAddress,
        type: TokenType.ERC20,
        symbol,
        name,
        decimals,
      },
      update: {},
    });
  }

  private async connectToContracts(
    provider: ethers.providers.WebSocketProvider,
  ) {
    this.pxContract = await this.getPxContract(provider);
    this.dogContract = await this.getDogContract(provider);
  }

  async getPxContract(signerOrProvider: Signer | Provider) {
    const pxContractInfo =
      ABI[this.ethersService.chainId][this.ethersService.network].contracts[
        'PX'
      ];
    return new ethers.Contract(
      pxContractInfo.address,
      pxContractInfo.abi,
      signerOrProvider,
    );
  }

  async getDogContract(signerOrProvider: any) {
    const dogContractInfo =
      ABI[this.ethersService.chainId][this.ethersService.network].contracts[
        'DOG20'
      ];
    return new ethers.Contract(
      dogContractInfo.address,
      dogContractInfo.abi,
      signerOrProvider,
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
    console.log('filter', filter);
    for (let i = fromBlock; i <= toBlock; i += step + 1) {
      await sleep(0.5);
      const _logs = await this.pxContract.queryFilter(filter, i, i + step);
      console.log('got logs', _logs.length);
      logs.push(..._logs);
    }
    this.logger.log(`Got pixel transfer logs of length: ${logs.length}`);
    return logs;
  }

  getDogLocked() {
    return this.dogContract.balanceOf(this.pxContract.address);
  }

  private getTreasuryBalance() {
    return this.dogContract.balanceOf(
      '0x563B1AE9717e9133b0C70D073C931368E1bd86E5',
    );
  }

  private getPleasrBalance() {
    return this.dogContract.balanceOf(
      '0xf894FeA045ECCB2927e2E0CB15C12debEE9f2BE8',
    );
  }

  private async getCirculatingSupply() {
    return this.dogContract.totalSupply();
  }

  async getPercentDogInPixels() {
    const dogLocked = await this.getDogLocked();
    const totalSupply = await this.getCirculatingSupply();
    const treasuryBalance = await this.getTreasuryBalance();
    const pleasrBalance = await this.getPleasrBalance();
    const supply = totalSupply.sub(treasuryBalance).sub(pleasrBalance);
    return Number(dogLocked.toString() / supply.toString()) * 100;
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

  async sendDogToAddressFromDripAddress(to: string, amount: number) {
    const amountAtoms = ethers.utils.parseEther(amount.toString());
    console.log(`sending: ${amountAtoms} -- to: ${to}`);
    const contract = await this.getDogContract(this.dripDogSigner);
    return contract.transfer(to, amountAtoms);
  }

  async getDogDripBalance() {
    return this.dogContract.balanceOf(this.dripDogSigner.address);
  }

  getDogDripAddress() {
    return this.dripDogSigner.address;
  }

  async getEthTxFeesForERC20Transfer(from, to, amount) {
    const gasLimit = await this.dogContract.estimateGas.transfer(to, amount, {
      from,
    });
    const gasPrice = await this.ethersService.provider.getGasPrice();
    const gasCost = gasLimit.mul(gasPrice);
    return gasCost.toString();
  }

  async getDripEthBalance() {
    return this.ethersService.provider.getBalance(this.dripDogSigner.address);
  }
}
