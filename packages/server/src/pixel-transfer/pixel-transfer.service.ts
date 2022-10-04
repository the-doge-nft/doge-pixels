import {forwardRef, Inject, Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {PixelsService} from "../pixels/pixels.service";
import {Event} from "@ethersproject/contracts/src.ts/index";
import {PixelTransferRepository} from "./pixel-transfer.repository";
import {ConfigService} from "@nestjs/config";
import {Configuration} from "../config/configuration";
import {EthersService} from "../ethers/ethers.service";
import {Events, PixelTransferEventPayload} from "../events";
import {OnEvent} from "@nestjs/event-emitter";
import {ethers} from "ethers";

@Injectable()
export class PixelTransferService implements OnModuleInit {
    private readonly logger = new Logger(PixelTransferService.name);

    constructor(
        @Inject(forwardRef(() => PixelsService))
        private readonly pixels: PixelsService,
        private readonly ethersService: EthersService,
        private readonly pixelTransfers: PixelTransferRepository,
        private readonly ethers: EthersService
    ) {}

    async onModuleInit() {
        // await this.pixelTransfers.dropAllTransfers()
    }

    async syncAll() {
        this.logger.log('Syncing all transfer events')
        return this.upsertTransfersFromLogs(await this.pixels.getAllPixelTransferLogs()).then(res => {
            this.logger.log('Done syncing transfer events')
        })
    }

    async syncFromBlockNumber(block: number) {
        this.logger.log(`Syncing transfers from block: ${block}`)
        return this.upsertTransfersFromLogs(await this.pixels.getPixelTransferLogs(block)).then(_ => {
            this.logger.log(`Done syncing transfers from block: ${block}`)
        })
    }

    private async upsertTransfersFromLogs(events: Event[]) {
        for (const event of events) {
            console.log(JSON.stringify(event))
            const { args, blockNumber } = event;
            const blockCreatedAt = await this.ethersService.getDateTimeFromBlockNumber(blockNumber)
            const { from, to, tokenId } = args;
            await this.pixelTransfers.upsert({
                tokenId: tokenId.toNumber(),
                from,
                to: to,
                blockNumber: blockNumber,
                uniqueTransferId: this.getUniqueTransferId(event),
                blockCreatedAt
            });
        }
    }

    private getUniqueTransferId(event: Event) {
        // https://ethereum.stackexchange.com/questions/55155/contract-event-transactionindex-and-logindex
        const { blockHash, transactionHash, logIndex } = event
        return `${blockHash}:${transactionHash}:${logIndex}`
    }

    async syncRecentTransfers() {
        const mostRecentBlock = await this.pixelTransfers.getMostRecentTransferBlockNumber()
        if (!mostRecentBlock) {
            return this.syncAll()
        } else {
            return this.syncFromBlockNumber(mostRecentBlock)
        }
    }

    @OnEvent(Events.PIXEL_TRANSFER)
    async handleNewTransfer({from, to, tokenId, blockNumber, blockCreatedAt, event}: PixelTransferEventPayload) {
        return this.pixelTransfers.upsert({
            from,
            to,
            tokenId,
            blockNumber,
            blockCreatedAt,
            uniqueTransferId: this.getUniqueTransferId(event)
        })
    }

    async getBalances() {
        const data = await this.pixelTransfers.findMany({
            distinct: ['tokenId'],
            orderBy: {
                insertedAt: 'desc',
            },
        });
        const map = {};

        for (const item of data) {
            if (item.to === ethers.constants.AddressZero) {
                continue;
            }
            if (map[item.to]?.tokenIds) {
                map[item.to].tokenIds.push(item.tokenId);
            } else {
                const ens = await this.ethers.getEnsName(item.to);
                map[item.to] = {
                    tokenIds: [item.tokenId],
                    ens: ens,
                };
            }
        }
        return map;
    }
}