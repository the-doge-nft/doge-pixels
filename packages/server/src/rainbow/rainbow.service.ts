import { BigNumber, ethers } from 'ethers';
import { PixelsService } from './../pixels/pixels.service';
import { AlchemyService } from './../alchemy/alchemy.service';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AssetTransfersOrder, AssetTransfersCategory } from 'alchemy-sdk';
import * as ABI from '../contracts/hardhat_contracts.json';

@Injectable()
export class RainbowService implements OnModuleInit {
    private logger = new Logger(RainbowService.name);
    private routerContractAddress = "0x00000000009726632680FB29d3F7A9734E3010E2"
    private dogAddress = ABI[1]["mainnet"].contracts['DOG20'].address

    async onModuleInit() {
        this.logger.log("Rainbow init 🌈")
        await this.DEBUG_ORDERS()
    }

    constructor(
        private readonly alchemy: AlchemyService
    ) {}

    async getDOGTransfersToRouter(maxCount: number) {
        const data = await this.alchemy.getAssetTransfers({
            order: AssetTransfersOrder.DESCENDING,
            toAddress: this.routerContractAddress,
            contractAddresses: [this.dogAddress],
            withMetadata: true,
            category: [
                AssetTransfersCategory.ERC20
            ],
            maxCount
        })
        return data?.transfers
    }

    async getTransfersToSwapContractForBlock(block: string) {
        const toTxs = (await this.alchemy.getAssetTransfers({
            order: AssetTransfersOrder.DESCENDING,
            toAddress: this.routerContractAddress,
            category: [
                AssetTransfersCategory.ERC20,
                // AssetTransfersCategory.INTERNAL,
                AssetTransfersCategory.EXTERNAL
            ],
            fromBlock: block,
            toBlock: block,
            withMetadata: true
        })).transfers
        const fromTxs = (await this.alchemy.getAssetTransfers({
            order: AssetTransfersOrder.DESCENDING,
            fromAddress: this.routerContractAddress,
            category: [
                AssetTransfersCategory.ERC20,
                // AssetTransfersCategory.INTERNAL,
                AssetTransfersCategory.EXTERNAL
            ],
            fromBlock: block,
            toBlock: block,
            withMetadata: true
        })).transfers
        return toTxs.concat(fromTxs)
    }

    async DEBUG_ORDERS() {
        const transfer = await this.getDOGTransfersToRouter(1)
        const tx = transfer[0]
        const blockNumber = ethers.BigNumber.from(tx.blockNum).toHexString()
        const hash = tx.hash
        const transfers = await this.getTransfersToSwapContractForBlock(blockNumber)
        transfers.filter(tx => tx.hash === hash)
        // transfer.sort((a, b) => {
        //     const aTimestamp = new Date(a.metadata.blockTimestamp);
        //     const bTimestamp = new Date(b.metadata.blockTimestamp);
        //     if (aTimestamp < bTimestamp) {
        //         return -1
        //     }
        //     return 1
        // })
        console.log(transfers)
    }

}
