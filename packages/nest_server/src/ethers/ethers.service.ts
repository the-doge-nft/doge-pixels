import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Events } from '../events';
import { AppEnv } from '../config/configuration';
import { InjectSentry, SentryService } from '@travelerdev/nestjs-sentry';
import { Cache } from 'cache-manager';

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
      this.network = 'rinkeby';
    } else if (appEnv === AppEnv.test) {
      this.network = 'localhost';
    } else {
      throw new Error('App environment unknown');
    }
  }

  async onModuleInit() {
    this.initWS();
    this.logger.log('resetting api cache');
    await this.cacheManager.reset();
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
    const cacheSeconds = 60 * 60 * 5;
    const noEns = 'NOENS';
    if (withCache) {
      this.logger.log(`1 (${cacheKey}): query from cache`);
      const ens = await this.cacheManager.get(cacheKey);
      this.logger.log(`2 (${cacheKey}): got from cache:: ${ens}`);

      if (ens === undefined) {
        this.logger.log(`3 (${cacheKey}) ens undefined, querying fresh`);
        // does not exist in cache
        const freshEns = await this.queryEnsName(address);
        this.logger.log(`4 (${cacheKey}) fresh ens:: ${freshEns}`);
        if (freshEns) {
          this.logger.log(`5 (${cacheKey}) setting to cache:: ${freshEns}`);
          const res = await this.cacheManager.set(cacheKey, freshEns, {
            ttl: cacheSeconds,
          });
          this.logger.log(
            `6 (${cacheKey}) return from setting cache: ${freshEns} - ${cacheSeconds} - ${res}`,
          );
          return freshEns;
        } else {
          this.logger.log(
            `7 (${cacheKey}) no ens found: ${noEns} - ${cacheSeconds}`,
          );
          await this.cacheManager.set(cacheKey, noEns, { ttl: cacheSeconds });
          return null;
        }
      } else if (ens === noEns) {
        this.logger.log(`8 (${cacheKey}) no ens found returning nulul`);
        // user does not have an ens name
        return null;
      }
      return ens;
    } else {
      return this.queryEnsName(address);
    }
  }

  private queryEnsName(address: string) {
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
}
