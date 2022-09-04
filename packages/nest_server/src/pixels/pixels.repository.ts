import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ethers } from 'ethers';
import { EthersService } from '../ethers/ethers.service';

@Injectable()
export class PixelsRepository {
  private readonly logger = new Logger(PixelsRepository.name);

  constructor(private prisma: PrismaService, private ethers: EthersService) {}

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
}
