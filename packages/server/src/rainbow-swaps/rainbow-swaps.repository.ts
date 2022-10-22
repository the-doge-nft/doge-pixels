import { PrismaService } from './../prisma.service';
import { Injectable } from '@nestjs/common';
import { RainbowSwaps } from '@prisma/client';

@Injectable()
export class RainbowSwapsRepository {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    create(args: any) {
        return this.prisma.rainbowSwaps.create({data: args})
    }
}
