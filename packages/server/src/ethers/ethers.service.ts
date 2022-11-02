import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  Logger,
  OnModuleInit
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectSentry, SentryService } from '@travelerdev/nestjs-sentry';
import { Cache } from 'cache-manager';
import { ethers } from 'ethers';
import { AppEnv } from '../config/configuration';
import { Events } from '../events';
import { getRandomIntInclusive } from '../helpers/numbers';

@Injectable()
export class EthersService implements OnModuleInit {
  private readonly logger = new Logger(EthersService.name);

  public network: string;
  public provider: ethers.providers.WebSocketProvider;
  public zeroAddress = ethers.constants.AddressZero;

  constructor(
    private configService: ConfigService<{
      appEnv: string;
      infura: { wsEndpoint: string };
    }>,
    private eventEmitter: EventEmitter2,
    @InjectSentry() private readonly sentryClient: SentryService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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

  async getEnsName(address: string, withCache = true) {
    const cacheKey = `ens:${address}`;
    const cacheSeconds = getRandomIntInclusive(60 * 60 * 10, 60 * 60 * 24);
    const noEns = 'NOENS';
    if (withCache) {
      const ens = await this.cacheManager.get<string>(cacheKey);
      if (!ens) {
        // does not exist in cache
        const freshEns = await this.queryEnsName(address);
        if (freshEns) {
          await this.cacheManager.set(cacheKey, freshEns, {
            ttl: cacheSeconds,
          });
          return freshEns;
        } else {
          await this.cacheManager.set(cacheKey, noEns, { ttl: cacheSeconds });
          return null;
        }
      } else if (ens === noEns) {
        // user does not have an ens name
        return null;
      }
      return ens;
    } else {
      return this.queryEnsName(address);
    }
  }

  private queryEnsName(address: string) {
    this.logger.log(`querying fresh ens: ${address}`);
    return this.provider.lookupAddress(address);
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
