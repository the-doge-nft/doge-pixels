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

  create({ from, to, tokenId }) {
    return this.prisma.pixels.create({
      data: {
        ownerAddress: to,
        tokenId,
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
        const cacheKey = `ens:${item.ownerAddress}`;

        let ens = await this.cacheManager.get(cacheKey);
        if (!ens) {
          ens = await this.ethers.getEnsName(item.ownerAddress);
          if (ens) {
            await this.cacheManager.set(cacheKey, ens, { ttl: 60000 * 60 });
          }
        }

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
}
