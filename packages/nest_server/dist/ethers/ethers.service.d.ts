import { OnModuleInit } from '@nestjs/common';
import { ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SentryService } from '@ntegral/nestjs-sentry';
export declare class EthersService implements OnModuleInit {
    private configService;
    private eventEmitter;
    private readonly sentryClient;
    private readonly logger;
    network: string;
    provider: ethers.providers.WebSocketProvider;
    constructor(configService: ConfigService<{
        appEnv: string;
        infura: {
            wsEndpoint: string;
        };
    }>, eventEmitter: EventEmitter2, sentryClient: SentryService);
    onModuleInit(): void;
    initWS(): void;
    keepAlive({ provider, onDisconnect, expectedPongBack, checkInterval, }: any): void;
    getEnsName(address: string): Promise<string>;
}
