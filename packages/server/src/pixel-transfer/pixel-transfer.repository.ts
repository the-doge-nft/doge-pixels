import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ethers } from 'ethers';
import { EthersService } from '../ethers/ethers.service';
import { Cache } from 'cache-manager';
import {PixelTransfers, PrismaClient} from '@prisma/client';

@Injectable()
export class PixelTransferRepository {
  private readonly logger = new Logger(PixelTransferRepository.name);

  constructor(
    private prisma: PrismaService,
    private ethers: EthersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  findOwnerByTokenId(tokenId: number) {
    return this.prisma.pixelTransfers.findMany({
      where: { tokenId },
      orderBy: {
        blockNumber: 'desc'
      },
      take: 1
    })[0]
  }

  create({ tokenId, from, to, blockNumber, uniqueTransferId }: Omit<PixelTransfers, 'updatedAt' | 'insertedAt' | 'id'>) {
    return this.prisma.pixelTransfers.create({
      data: {
        tokenId,
        from,
        to,
        blockNumber,
        uniqueTransferId
      },
    });
  }

  generateFilterQuery(filter) {
    const filterQuery = {};
    if (filter?.from) {
      filterQuery['from'] = {
        equals: filter.from,
        mode: 'insensitive',
      }
    }

    if (filter?.to) {
      filterQuery['to'] = {
        equals: filter.to,
        mode: 'insensitive',
      }
    }

    if (filter?.tokenId) {
      filterQuery['tokenId'] = {
        equals: filter.tokenId,
      }
    }

    if (filter?.fromBlockNumber !== null && filter?.fromBlockNumber !== undefined) {
      filterQuery['blockNumber'] = {
        gte: filter.fromBlockNumber,
      }
    }
    if (filter?.toBlockNumber) {
      filterQuery['blockNumber'] = {
        lte: filter.toBlockNumber,
      }
    }
    return filterQuery;
  }

  generateSortQuery(sort) {
    const sortQuery = {};
    for(const key in sort) {
      sortQuery[key] = sort[key].toLowerCase();
    }

    return sortQuery;
  }

  // @next TODO: acccept array of filters & add paging
  async getPixelTransfers(filter, sort) {
    const filterQuery = this.generateFilterQuery(filter);
    const sortQuery = this.generateSortQuery(sort);
    return this.prisma.pixelTransfers.findMany({
      where: filterQuery,
      orderBy: sortQuery,
      take: 100
    });
  }

  async upsert({ tokenId, from, to, blockNumber, uniqueTransferId }: Omit<PixelTransfers, 'updatedAt' | 'insertedAt' | 'id'>) {
    return this.prisma.pixelTransfers.upsert({
      where: { uniqueTransferId },
      create: {
        tokenId,
        from,
        to,
        blockNumber,
        uniqueTransferId
      },
      update: {
        from,
        to,
        tokenId
      }
    })
  }

  async getMostRecentTransferBlockNumber() {
    return (await this.prisma.pixelTransfers.findMany({
      orderBy: {
        blockNumber: "desc"
      },
      take: 1
    }))[0]?.blockNumber
  }

  dropAll() {
    return this.prisma.pixelTransfers.deleteMany()
  }

  findMany(args: any) {
    return this.prisma.pixelTransfers.findMany(args)
  }
}
