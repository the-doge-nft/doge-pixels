import { Event } from '@ethersproject/contracts/src.ts/index';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ethers } from 'ethers';
import { EthersService } from '../ethers/ethers.service';
import { Events, PixelTransferEventPayload } from '../events';
import { OwnTheDogeContractService } from '../ownthedoge-contracts/ownthedoge-contracts.service';
import { UnstoppableDomainsService } from '../unstoppable-domains/unstoppable-domains.service';
import { PixelTransferRepository } from './pixel-transfer.repository';

@Injectable()
export class PixelTransferService {
  private readonly logger = new Logger(PixelTransferService.name);

  constructor(
    @Inject(forwardRef(() => OwnTheDogeContractService))
    private readonly pixels: OwnTheDogeContractService,
    private readonly ethersService: EthersService,
    private readonly pixelTransfers: PixelTransferRepository,
    private readonly ethers: EthersService,
    private readonly ud: UnstoppableDomainsService,
  ) {}

  async syncAll() {
    this.logger.log('Syncing all pixel transfer events');
    return this.upsertTransfersFromLogs(
      await this.pixels.getAllPixelTransferLogs(),
    ).then((res) => {
      this.logger.log('Done syncing pixel transfer events');
    });
  }

  async syncFromBlockNumber(block: number) {
    this.logger.log(`Syncing pixel transfers from block: ${block}`);
    return this.upsertTransfersFromLogs(
      await this.pixels.getPixelTransferLogs(block),
    ).then((_) => {
      this.logger.log(`Done syncing pixel transfers from block: ${block}`);
    });
  }

  private async upsertTransfersFromLogs(events: Event[]) {
    for (const event of events) {
      const { args, blockNumber } = event;
      const blockCreatedAt =
        await this.ethersService.getDateTimeFromBlockNumber(blockNumber);
      const { from, to, tokenId } = args;
      await this.pixelTransfers.upsert({
        tokenId: tokenId.toNumber(),
        from,
        to: to,
        blockNumber: blockNumber,
        uniqueTransferId: this.getUniqueTransferId(event),
        blockCreatedAt,
      });
    }
  }

  private getUniqueTransferId(event: Event) {
    // https://ethereum.stackexchange.com/questions/55155/contract-event-transactionindex-and-logindex
    const { blockHash, transactionHash, logIndex } = event;
    return `${blockHash}:${transactionHash}:${logIndex}`;
  }

  async syncRecentTransfers() {
    const mostRecentBlock =
      await this.pixelTransfers.getMostRecentTransferBlockNumber();
    if (!mostRecentBlock) {
      return this.syncAll();
    } else {
      return this.syncFromBlockNumber(mostRecentBlock);
    }
  }

  @OnEvent(Events.PIXEL_TRANSFER)
  async handleNewTransfer({
    from,
    to,
    tokenId,
    blockNumber,
    blockCreatedAt,
    event,
  }: PixelTransferEventPayload) {
    try {
      await Promise.all([
        this.ethers.refreshEnsCache(from),
        this.ethers.refreshEnsCache(to),
      ]);
    } catch (e) {}
    return this.pixelTransfers.upsert({
      from,
      to,
      tokenId,
      blockNumber,
      blockCreatedAt,
      uniqueTransferId: this.getUniqueTransferId(event),
    });
  }

  async getBalances() {
    const data = await this.pixelTransfers.findMany({
      distinct: ['tokenId'],
      orderBy: {
        insertedAt: 'desc',
      },
    });
    const balances = {};

    for (const item of data) {
      const isPixelBurn = item.to === ethers.constants.AddressZero;
      if (!isPixelBurn) {
        if (balances[item.to]?.tokenIds) {
          balances[item.to].tokenIds.push(item.tokenId);
        } else {
          const ens = await this.ethers.getCachedEnsName(item.to);
          const ud = await this.ud.getCachedName(item.to);

          balances[item.to] = {
            tokenIds: [item.tokenId],
            ens,
            ud,
          };
        }
      }
    }
    return balances;
  }
}
