import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Alchemy, AssetTransfersWithMetadataParams, Network } from 'alchemy-sdk';
import { Configuration } from '../config/configuration';

@Injectable()
export class AlchemyService implements OnModuleInit {
    private logger = new Logger(AlchemyService.name);
    private alchemy: Alchemy


    constructor(
        private readonly configService: ConfigService<Configuration>,
    ){
        this.alchemy = new Alchemy({
            apiKey: this.configService.get("alchemyKey"),
            network: Network.ETH_MAINNET
        })
    }

    onModuleInit() {
        this.logger.log("Alchemy init")   
    }

    getAssetTransfers(params: AssetTransfersWithMetadataParams) {
        return this.alchemy.core.getAssetTransfers(params)
    }
}
