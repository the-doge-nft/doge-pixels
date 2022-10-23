import { PrismaService } from './../prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class RainbowSwapsRepository {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    create(args: Prisma.RainbowSwapsCreateInput) {
        return this.prisma.rainbowSwaps.create({data: args})
    }

    upsert(txHash: string, create: Prisma.RainbowSwapsCreateInput, update?: Prisma.RainbowSwapsUpdateInput) {
        return this.prisma.rainbowSwaps.upsert({
            where: { txHash },
            update: { ...update },
            create: { ...create }
        })
    }

    async getMostRecentSwapBlockNumber() {
        return (
            await this.prisma.rainbowSwaps.findMany({
                orderBy: {
                    blockNumber: 'desc'
                },
                take: 1
            })
        )[0]?.blockNumber
    }
}
