import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EthersService } from 'src/ethers/ethers.service';

@Injectable()
export class RainbowService implements OnModuleInit {
    private logger = new Logger(RainbowService.name);
    private routerContractAddress = "0x00000000009726632680FB29d3F7A9734E3010E2"

    onModuleInit() {
        this.logger.log("Rainbow init 🌈")
    }

    constructor(
        private readonly ethers: EthersService
    ) {
        
    }

}
