import { Injectable } from '@nestjs/common';
import { PrismaService } from "../prisma.service";

@Injectable()
export class PixelTransfersService {
    constructor(private prismaService: PrismaService) {}

    create(from: string, to: string, tokenId: number, txHash: string) {
        return this.prismaService.pixelTransfers.create({
            data: {
                transactedAt: new Date(),
                from,
                to,
                tokenId,
                txHash
            }
        })
    }
}
