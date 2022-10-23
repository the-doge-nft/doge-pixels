import { Injectable } from '@nestjs/common';
import { Prisma, RainbowSwaps } from '@prisma/client';
import { EthersService } from '../ethers/ethers.service';
import { PrismaService } from './../prisma.service';

@Injectable()
export class RainbowSwapsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ethers: EthersService
    ) {}

  private async afterGetSwaps(swaps: RainbowSwaps[]) {
    const data: (RainbowSwaps & {clientEns: string, donatedUSDNotional: number})[] = []
    for (let i = 0; i < swaps.length; i++) {
      const swap = swaps[i]
      const clientEns = await this.ethers.getEnsName(swap.clientAddress)

      // @next @TODO: get USD notional value from token price lookup
      data.push({...swap, clientEns, donatedUSDNotional: 0})
    }
    return data
  }
    
  create(args: Prisma.RainbowSwapsCreateInput) {
    return this.prisma.rainbowSwaps.create({ data: args });
  }

  upsert(
    txHash: string,
    create: Prisma.RainbowSwapsCreateInput,
    update?: Prisma.RainbowSwapsUpdateInput,
  ) {
    return this.prisma.rainbowSwaps.upsert({
      where: { txHash },
      update: { ...update },
      create: { ...create },
    });
  }

  async getMostRecentSwapBlockNumber() {
    return (
      await this.prisma.rainbowSwaps.findMany({
        orderBy: {
          blockNumber: 'desc',
        },
        take: 1,
      })
    )[0]?.blockNumber;
  }

  async getSwaps() {
    const swaps = await this.prisma.rainbowSwaps.findMany({
      orderBy: {
        blockCreatedAt: 'desc',
      },
    });
    return this.afterGetSwaps(swaps)
  }
}
