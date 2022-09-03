import { PixelsService } from './pixels/pixels.service';
import { EthersService } from './ethers/ethers.service';
import { HttpService } from '@nestjs/axios';
import { PixelsRepository } from './pixels/pixels.repository';
export declare class AppController {
    private readonly pixelService;
    private readonly pixelsRepository;
    private readonly ethersService;
    private readonly httpService;
    private logger;
    constructor(pixelService: PixelsService, pixelsRepository: PixelsRepository, ethersService: EthersService, httpService: HttpService);
    getStatus(): string;
    getOwnershipConfig(): Promise<{}>;
    getConfigRefreshed(): Promise<{}>;
    getPictureDimensions(): Promise<{
        widht: any;
        height: any;
    }>;
    getPixelAddressBalance(params: {
        address: string;
    }): Promise<{
        balance: any;
    }>;
    getOwnerByTokenId(params: {
        tokenId: number;
    }): Promise<{
        address: string;
    }>;
    getDogLocked(): Promise<{
        balance: string;
    }>;
    getContractAddresses(): {
        dog: string;
        pixel: string;
    };
    getEnsAddress(params: any): Promise<{
        ens: string;
    }>;
    getPixelMetadata(params: any): Promise<boolean>;
}
