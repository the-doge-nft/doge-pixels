import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectSentry, SentryService } from '@travelerdev/nestjs-sentry';
import { ethers } from 'ethers';
import { AppEnv } from '../config/configuration';
import { Events } from '../events';
import { CacheService } from './../cache/cache.service';

@Injectable()
export class EthersService implements OnModuleInit {
  private readonly logger = new Logger(EthersService.name);
  private secondsToCache = 60 * 60 * 10;

  public network: string;
  public provider: ethers.providers.WebSocketProvider;
  public zeroAddress = ethers.constants.AddressZero;

  private getEnsCacheKey(address: string) {
    return `ens:${address}`;
  }

  constructor(
    private configService: ConfigService<{
      appEnv: string;
      infura: { wsEndpoint: string };
    }>,
    private eventEmitter: EventEmitter2,
    @InjectSentry() private readonly sentryClient: SentryService,
    private readonly cache: CacheService,
  ) {
    const appEnv = this.configService.get('appEnv');
    if (appEnv === AppEnv.production) {
      this.network = 'mainnet';
    } else if (appEnv === AppEnv.development || appEnv === AppEnv.staging) {
      this.network = 'goerli';
    } else if (appEnv === AppEnv.test) {
      this.network = 'localhost';
    } else {
      throw new Error('App environment unknown');
    }
  }

  async onModuleInit() {
    this.initWS();
  }

  initWS() {
    const logMessage = `Creating WS provider on network: ${this.network}`;
    this.logger.log(logMessage);
    this.sentryClient.instance().captureMessage(logMessage);

    if (this.configService.get('appEnv') === AppEnv.test) {
      this.provider = new ethers.providers.WebSocketProvider(
        `ws://127.0.0.1:8545`,
      );
    } else {
      this.provider = new ethers.providers.WebSocketProvider(
        this.configService.get('infura').wsEndpoint,
        this.network,
      );
    }
    this.eventEmitter.emit(Events.ETHERS_WS_PROVIDER_CONNECTED, this.provider);

    if (this.configService.get('appEnv') !== AppEnv.test) {
      this.keepAlive({
        provider: this.provider,
        onDisconnect: () => {
          this.initWS();
        },
      });
    }
  }

  // the ws connection from infura often drops which we *cannot* have happen
  // as we need to be listening to contract events at all times
  keepAlive({
    provider,
    onDisconnect,
    expectedPongBack = 15000,
    checkInterval = 7500,
  }: any) {
    let pingTimeout: any;
    let keepAliveInterval: any;

    provider._websocket.on('open', () => {
      keepAliveInterval = setInterval(() => {
        provider._websocket.ping();

        pingTimeout = setTimeout(() => {
          provider._websocket.terminate();
        }, expectedPongBack);
      }, checkInterval);
    });

    provider._websocket.on('close', (err) => {
      const logMessage = 'Websocket connection closed';
      this.logger.error(logMessage);
      this.sentryClient.instance().captureMessage(logMessage);

      if (keepAliveInterval) {
        clearInterval(keepAliveInterval);
      }

      if (pingTimeout) {
        clearTimeout(pingTimeout);
      }

      onDisconnect(err);
    });

    provider._websocket.on('pong', () => {
      if (pingTimeout) {
        clearTimeout(pingTimeout);
      }
    });
  }

  async getEnsName(address: string) {
    this.logger.log(`querying ens: ${address}`);
    return this.provider.lookupAddress(address);
  }

  async refreshEnsCache(address: string) {
    const ens = await this.getEnsName(address);
    await this.cache.set(
      this.getEnsCacheKey(address),
      ens,
      this.secondsToCache,
    );
  }

  getCachedEnsName(address: string) {
    return this.cache.get<string>(this.getEnsCacheKey(address));
  }

  getIsValidEthereumAddress(address: string) {
    try {
      ethers.utils.getAddress(address);
      return true;
    } catch (e) {
      return false;
    }
  }

  async getDateTimeFromBlockNumber(blockNumber: number) {
    const block = await this.provider.getBlock(blockNumber);
    return new Date(block.timestamp * 1000);
  }

  getIsAddressEqual(addr1: string, addr2: string) {
    return ethers.utils.getAddress(addr1) === ethers.utils.getAddress(addr2);
  }
}
