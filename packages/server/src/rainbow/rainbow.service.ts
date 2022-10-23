import { EthersService } from './../ethers/ethers.service';
import { BigNumber, ethers } from 'ethers';
import { OwnTheDogeContractService } from '../ownthedoge-contracts/ownthedoge-contracts.service';
import { AlchemyService } from './../alchemy/alchemy.service';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AssetTransfersOrder, AssetTransfersCategory, AssetTransfersWithMetadataResult } from 'alchemy-sdk';
import * as ABI from '../contracts/hardhat_contracts.json';
import { RainbowSwapsRepository } from '../rainbow-swaps/rainbow-swaps.repository';
import { ClientSide, RainbowSwaps } from '@prisma/client';
import sleep from '../helpers/sleep';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class RainbowService implements OnModuleInit {
    private logger = new Logger(RainbowService.name);
    private routerContractAddress = "0x00000000009726632680FB29d3F7A9734E3010E2"
    private dogAddress = ABI[1]["mainnet"].contracts['DOG20'].address

    async onModuleInit() {
        this.logger.log("Rainbow init 🌈")
        this.listenForTransfersThroughRouter()
        this.syncRecentDOGSwaps()
    }

    constructor(
        private readonly alchemy: AlchemyService,
        private readonly ethers: EthersService,
        private readonly rainbowSwapRepo: RainbowSwapsRepository
    ) {}

    @Cron(CronExpression.EVERY_10_MINUTES)
    private async syncRecentDOGSwaps() {
        this.logger.log('Syncing rainbow DOG swaps')
        const block = await this.rainbowSwapRepo.getMostRecentSwapBlockNumber()
        if (!block) {
            await this.syncAllDOGSwaps()
        } else {
            await this.syncDOGSwapsFromBlock(block)
        }
    }

    private listenForTransfersThroughRouter() {
        this.alchemy.initWs(this.routerContractAddress, this.onNewTransfer)
    }

    private onNewTransfer(payload: any) {
        console.log("NEW DOG TRANSFER TO THE ROUTER")
        console.log(payload)
    }

    private async getDOGTransfersToRouterFromBlock(fromBlock: string) {
        const data = await this.alchemy.getAssetTransfers({
            order: AssetTransfersOrder.DESCENDING,
            toAddress: this.routerContractAddress,
            contractAddresses: [this.dogAddress],
            withMetadata: true,
            category: [
                AssetTransfersCategory.ERC20
            ],
            maxCount: 1000,
            fromBlock
        })
        if (data.pageKey) {
            throw new Error("There is paging data we don't handle currently")
        }
        return data?.transfers
    }

    private async getAllDOGTransfersToRouter() {
        const data = await this.alchemy.getAssetTransfers({
            order: AssetTransfersOrder.DESCENDING,
            toAddress: this.routerContractAddress,
            contractAddresses: [this.dogAddress],
            withMetadata: true,
            category: [
                AssetTransfersCategory.ERC20
            ],
            maxCount: 1000
        })
        if (data.pageKey) {
            throw new Error("There is paging data we don't handle currently")
        }
        return data?.transfers
    }

    private async getRouterTransfersByBlock(block: string) {
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

    private async syncDOGSwapsFromBlock(blockNumber: number) {
        this.logger.log(`Syncing DOG swaps from block: ${blockNumber}`)
        const transfers = await this.getDOGTransfersToRouterFromBlock(ethers.BigNumber.from(blockNumber).toHexString())
        await this.insertDOGSwaps(transfers)
    }

    private async syncAllDOGSwaps() {
        this.logger.log("Syncing all DOG swaps")
        const transfers = await this.getAllDOGTransfersToRouter()
        this.insertDOGSwaps(transfers)
    }

    private async insertDOGSwaps(transfers) {
        for (let i = 0; i < transfers.length; i++) {
            const transfer = transfers[i]
            this.logger.log(`processing DOG swap in tx: ${transfer.hash}`)
        
            const blockNumber = ethers.BigNumber.from(transfer.blockNum)
            const allTransfers = (await this.getRouterTransfersByBlock(blockNumber.toHexString())).filter(tx => tx.hash === transfer.hash)
            try {
                const order = this.getOrderFromAssetTransfers(allTransfers)
                await this.rainbowSwapRepo.upsert(transfer.hash, order)
            } catch (e) {
                this.logger.error(`Could not insert rainbow swap: ${transfer.hash}`)
            }
            // make sure we don't make alchemy angry!
            await sleep(1)
        }
    }

    private getOrderFromAssetTransfers(trace: AssetTransfersWithMetadataResult[]): Omit<RainbowSwaps, 'id' | 'insertedAt' | 'updatedAt'> {
        const external = trace.filter(tx => tx.category === AssetTransfersCategory.EXTERNAL)
        const internal = trace.filter(tx => tx.category === AssetTransfersCategory.INTERNAL)
        const erc20 = trace.filter(tx => tx.category === AssetTransfersCategory.ERC20)
        erc20.sort((a, b) => {
            // uniqueId is missing from the type for some reason
            // https://docs.alchemy.com/changelog/08262022-unique-ids-for-alchemy_getassettransfers
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
            // ETH transfer to OR from the contract
            const externalToContract = external.filter(tx => this.ethers.getIsAddressEqual(tx.to, this.routerContractAddress))
            const internalFromContract = internal.filter(tx => this.ethers.getIsAddressEqual(tx.from, this.routerContractAddress))

            if (externalToContract.length > 1 || internalFromContract.length > 1) {
                this.logger.error("There are multiple external to contract & internal from contract calls -- not prepared to handle")
                this.logger.error(`external to contract: ${JSON.stringify(externalToContract)}`)
                this.logger.error(`internal from contract: ${JSON.stringify(internalFromContract)}`)
                throw new Error("Shouldn't hit")
            }

            if (externalToContract.length > 0 && internalFromContract.length > 0) {
                soldOrder = externalToContract[0]
                boughtOrder = erc20[erc20.length - 1]
            } else if (externalToContract.length === 0) {
                boughtOrder = internalFromContract[0]
                soldOrder = erc20[0]
            } else {
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
            clientSide = ClientSide.SELL
            quoteCurrency = boughtOrder.asset
            quoteAmount = boughtOrder.value
            baseAmount = soldOrder.value
        } else {
            clientSide = ClientSide.BUY
            quoteCurrency = soldOrder.asset
            quoteAmount = soldOrder.value
            baseAmount = boughtOrder.value
        }

        return {
            clientSide,
            baseCurrency,
            quoteCurrency,
            quoteAmount,
            baseAmount,
            blockCreatedAt: new Date(boughtOrder.metadata.blockTimestamp),
            txHash: boughtOrder.hash,
            blockNumber: ethers.BigNumber.from(boughtOrder.blockNum).toNumber()
        }
    }

}
