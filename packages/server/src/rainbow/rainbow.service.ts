import { EthersService } from './../ethers/ethers.service';
import { BigNumber, ethers } from 'ethers';
import { PixelsService } from './../pixels/pixels.service';
import { AlchemyService } from './../alchemy/alchemy.service';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AssetTransfersOrder, AssetTransfersCategory, AssetTransfersWithMetadataResult } from 'alchemy-sdk';
import * as ABI from '../contracts/hardhat_contracts.json';
import { RainbowSwapsRepository } from '../rainbow-swaps/rainbow-swaps.repository';
import { ClientSide } from '@prisma/client';

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
        private readonly alchemy: AlchemyService,
        private readonly ethers: EthersService,
        private readonly rainbowSwapRepo: RainbowSwapsRepository
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

    async getRouterTransfersByBlock(block: string) {
        const toTxs = (await this.alchemy.getAssetTransfers({
            order: AssetTransfersOrder.DESCENDING,
            toAddress: this.routerContractAddress,
            category: [
                AssetTransfersCategory.ERC20,
                AssetTransfersCategory.INTERNAL,
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
                AssetTransfersCategory.INTERNAL,
                AssetTransfersCategory.EXTERNAL
            ],
            fromBlock: block,
            toBlock: block,
            withMetadata: true
        })).transfers
        return toTxs.concat(fromTxs)
    }

    async DEBUG_ORDERS() {
        const transfers = await this.getDOGTransfersToRouter(1000)
        for (let i = 0; i < transfers.length; i++) {
            const transfer = transfers[i]
            this.logger.log(`processing tx: ${transfer.hash}`)
        
            const blockNumber = ethers.BigNumber.from(transfer.blockNum)
            const allTransfers = (await this.getRouterTransfersByBlock(blockNumber.toHexString())).filter(tx => tx.hash === transfer.hash)
            const order = this.getOrderFromAssetTransfers(allTransfers)
            this.logger.log({...order, txHash: transfer.hash})
            await this.rainbowSwapRepo.create({
                blockNumber: blockNumber.toNumber(),
                blockCreatedAt: new Date(),
                baseCurrency: order.baseCurrency,
                quoteCurrency: order.quoteCurrency,
                baseAmount: order.baseAmount,
                quoteAmount: order.quoteAmount,
                clientSide: order.clientSide === "sell" ? ClientSide.SELL : ClientSide.BUY,
                txHash: transfer.hash
            })
        }
    }

    getOrderFromAssetTransfers(trace: AssetTransfersWithMetadataResult[]) {
        const external = trace.filter(tx => tx.category === AssetTransfersCategory.EXTERNAL)
        const internal = trace.filter(tx => tx.category === AssetTransfersCategory.INTERNAL)
        const erc20 = trace.filter(tx => tx.category === AssetTransfersCategory.ERC20)
        erc20.sort((a, b) => {
            // @ts-ignore
            const aLogNumber = Number(a.uniqueId.split(":")[2])
            // @ts-ignore
            const bLogNumber = Number(b.uniqueId.split(":")[2])
            if (aLogNumber < bLogNumber) {
                return -1
            }
            return 1
        })

        let soldOrder: AssetTransfersWithMetadataResult
        let boughtOrder: AssetTransfersWithMetadataResult

        // erc20 for erc20 swap
        if (external.length === 0 && internal.length === 0) {
            soldOrder = erc20[0]
            boughtOrder = erc20[erc20.length - 1]
        } else {
            const externalToContract = external.filter(tx => this.ethers.getIsAddressEqual(tx.to, this.routerContractAddress))
            const internalFromContract = internal.filter(tx => this.ethers.getIsAddressEqual(tx.from, this.routerContractAddress))

            if (externalToContract.length > 1 || internalFromContract.length > 1) {
                console.log(externalToContract)
                console.log(internalFromContract)
                throw new Error("Shouldn't hit")
            }

            if (externalToContract.length > 0 && internalFromContract.length > 0) {
                soldOrder = externalToContract[0]
                boughtOrder = erc20[erc20.length - 1]
            } else if (externalToContract.length === 0) {
                console.log('hit 1')
                boughtOrder = internalFromContract[0]
                soldOrder = erc20[0]
            } else {
                console.log('hit 2')
                soldOrder = externalToContract[0]
                boughtOrder = erc20[erc20.length - 1]
            }
        }

        if (soldOrder.asset !== "DOG" && boughtOrder.asset !== "DOG") {
            throw new Error("One of these orders should be an order for DOG")
        }

        let clientSide, quoteCurrency, quoteAmount, baseAmount

        const baseCurrency = "DOG"

        if (soldOrder.asset === "DOG") {
            clientSide = "sell"
            quoteCurrency = boughtOrder.asset
            quoteAmount = boughtOrder.value
            baseAmount = soldOrder.value
        } else {
            clientSide = "buy"
            quoteCurrency = soldOrder.asset
            quoteAmount = soldOrder.value
            baseAmount = boughtOrder.value
        }

        return {
            clientSide,
            baseCurrency,
            quoteCurrency,
            quoteAmount,
            baseAmount
        }
    }

}
