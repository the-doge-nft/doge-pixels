import { OnModuleInit } from '@nestjs/common';
import { ethers } from 'ethers';
import { EthersService } from '../ethers/ethers.service';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../config/configuration';
import { PixelsRepository } from './pixels.repository';
import { SentryService } from '@ntegral/nestjs-sentry';
export declare class PixelsService implements OnModuleInit {
    private ethersService;
    private configService;
    private pixelsRepository;
    private readonly sentryClient;
    private readonly logger;
    private pxContract;
    private dogContract;
    constructor(ethersService: EthersService, configService: ConfigService<Configuration>, pixelsRepository: PixelsRepository, sentryClient: SentryService);
    onModuleInit(): Promise<void>;
    handleProviderConnected(provider: ethers.providers.WebSocketProvider): Promise<void>;
    private initContracts;
    private connectToContracts;
    private initPixelListener;
    syncTransfers(): Promise<void>;
    getAllPixelTransferLogs(): Promise<any[]>;
    getDogLocked(): any;
    getContractAddresses(): {
        dog: string;
        pixel: string;
    };
    getPixelURI(tokenId: string): any;
    getDimensions(): Promise<{
        widht: any;
        height: any;
    }>;
    getPixelBalanceByAddress(address: string): any;
}
