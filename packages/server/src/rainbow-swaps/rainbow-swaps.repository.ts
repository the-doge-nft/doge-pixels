import { Injectable } from '@nestjs/common';
import { EthereumNetwork, Prisma, RainbowSwaps } from '@prisma/client';
import { CoinGeckoService } from '../coin-gecko/coin-gecko.service';
import { EthersService } from '../ethers/ethers.service';
import { CacheService } from './../cache/cache.service';
import { PrismaService } from './../prisma.service';

export interface RainbowSwapAfterGet extends RainbowSwaps {
  clientEns: string;
  donatedUSDNotional: number;
}

@Injectable()
export class RainbowSwapsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ethers: EthersService,
    private readonly coingecko: CoinGeckoService,
    private readonly cache: CacheService,
  ) {}

  private async afterGetSwaps(swaps: RainbowSwaps[]) {
    const data: Array<RainbowSwapAfterGet> = [];
    for (const swap of swaps) {
      const clientEns = await this.ethers.getCachedEnsName(swap.clientAddress);
      let donatedCurrencyPrice: number;
      try {
        if (swap.donatedCurrencyAddress === null) {
          donatedCurrencyPrice = await this.coingecko.getCachedEthPrice();
        } else {
          donatedCurrencyPrice = await this.coingecko.getCachedPrice(
            swap.donatedCurrencyAddress,
          );
        }
      } catch (e) {
        donatedCurrencyPrice = 0;
      }

      const donatedUSDNotional = donatedCurrencyPrice * swap.donatedAmount;
      data.push({ ...swap, clientEns, donatedUSDNotional });
    }
    return data;
  }

  create(args: Prisma.RainbowSwapsCreateInput) {
    return this.prisma.rainbowSwaps.create({ data: args });
  }

  upsert(swap: Prisma.RainbowSwapsCreateInput) {
    return this.prisma.rainbowSwaps.upsert({
      where: { txHash: swap.txHash },
      create: { ...swap },
      update: { ...swap },
    });
  }

  async getMostRecentSwapBlockNumber(network: EthereumNetwork) {
    return (
      await this.prisma.rainbowSwaps.findMany({
        orderBy: {
          blockNumber: 'desc',
        },
        where: {
          network,
        },
        take: 1,
      })
    )[0]?.blockNumber;
  }

  async findMany(args?: Prisma.RainbowSwapsFindManyArgs) {
    // only swaps starting on Nov 2nd 2002 count
    const swaps = await this.prisma.rainbowSwaps.findMany(args);
    return this.afterGetSwaps(swaps);
  }
}
