import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Events } from '../events';

@Injectable()
export class EthersService implements OnModuleInit {
  private readonly logger = new Logger(EthersService.name);

  public network: string;
  public provider: ethers.providers.WebSocketProvider;

  constructor(
    private configService: ConfigService<{
      appEnv: string;
      infura: { wsEndpoint: string };
    }>,
    private eventEmitter: EventEmitter2,
  ) {
    const appEnv = this.configService.get('appEnv');
    if (appEnv === 'production') {
      this.network = 'mainnet';
    } else if (appEnv === 'development') {
      this.network = 'rinkeby';
    } else if (appEnv === 'test') {
      this.network = 'localhost';
    } else {
      throw new Error('App environment unknown');
    }
  }

  onModuleInit() {
    this.logger.log('EthersService is loaded');
    this.initWS();
  }

  initWS() {
    this.logger.log(`Creating WS provider on network: ${this.network}`);
    if (this.configService.get('appEnv') === 'test') {
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

    if (this.configService.get('appEnv') !== 'test') {
      this.keepAlive({
        provider: this.provider,
        onDisconnect: () => {
          this.logger.error('websocket connection lost');
          this.initWS();
        },
      });
    }
  }

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
      this.logger.error('Websocket connection closed');
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
}
