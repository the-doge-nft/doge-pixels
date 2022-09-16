import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ethers } from 'ethers';
import { EthersService } from '../ethers/ethers.service';
import { Cache } from 'cache-manager';

@Injectable()
export class PixelsRepository {
  private readonly logger = new Logger(PixelsRepository.name);

  constructor(
    private prisma: PrismaService,
    private ethers: EthersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  findByTokenId(tokenId: number) {
    return this.prisma.pixels.findUnique({ where: { tokenId } });
  }

  create({ to, tokenId }) {
    return this.prisma.pixels.create({
      data: {
        ownerAddress: to,
        tokenId,
      },
    });
  }

  upsert({ tokenId, ownerAddress }: { tokenId: number; ownerAddress: string }) {
    return this.prisma.pixels.upsert({
      where: { tokenId },
      update: { ownerAddress },
      create: {
        tokenId,
        ownerAddress,
      },
    });
  }

  updateOwner({
    tokenId,
    ownerAddress,
  }: {
    tokenId: number;
    ownerAddress: string;
  }) {
    return this.prisma.pixels.update({
      where: { tokenId },
      data: {
        ownerAddress,
        updatedAt: new Date(),
      },
    });
  }

  deleteAll() {
    return this.prisma.pixels.deleteMany();
  }

  async getOwnershipMap() {
    const map = {};
    const data = await this.prisma.pixels.findMany();
    for (const item of data) {
      if (map[item.ownerAddress]?.tokenIds) {
        map[item.ownerAddress].tokenIds.push(item.tokenId);
      } else {
        const ens = await this.ethers.getEnsName(item.ownerAddress);
        map[item.ownerAddress] = {
          tokenIds: [item.tokenId],
          ens: ens,
        };
      }
    }
    // remove zero address for now
    delete map[ethers.constants.AddressZero];
    return map;
  }

  async getOwnershipBalances() {
    const query = {

    }
    const data = await this.prisma.pixelTransfers.findMany({
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

  addTransferEvent({ tokenId, from, to, blockNumber }: { tokenId: number; from: string; to: string; blockNumber: number }) {
    return this.prisma.pixelTransfers.create({
      data: {
        tokenId,
        from,
        to,
        blockNumber
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

    if (filter?.fromBlockNumber) {
      filterQuery['blockNumber'] = {
        gte: filter.fromBlockNumber,
      }
    }
    if (filter?.toBlockNumber) {
      filterQuery['blockNumber'] = {
        lte: filter.toBlockNumber,
      }
    }
    if (filter?.fromDate) {
      filterQuery['insertedAt'] = {
        gte: new Date(filter.fromDate),
      }
    }
    if (filter?.toDate) {
      filterQuery['insertedAt'] = {
        lte: new Date(filter.toDate),
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
  async getTransferEvents(filter, sort) {
    const filterQuery = this.generateFilterQuery(filter);
    const sortQuery = this.generateSortQuery(sort);

    this.logger.log("filterQuery", filterQuery);
    this.logger.log("sortQuery", sortQuery);
    const data = await this.prisma.pixelTransfers.findMany({
      where: filterQuery,
      orderBy: sortQuery,
    });
     
    return data;
  }
}
