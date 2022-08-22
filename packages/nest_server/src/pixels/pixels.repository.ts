import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from "../prisma.service";

@Injectable()
export class PixelsRepository {
    private readonly logger = new Logger(PixelsRepository.name);

    constructor(private prisma: PrismaService) {}

    findByTokenId(tokenId: number) {
        return this.prisma.pixels.findUnique({where: { tokenId }})
    }

    create({from, to, tokenId}) {
        return this.prisma.pixels.create({
            data: {
                ownerAddress: to,
                tokenId,
                name: 'test',
                description: 'test',
                tokenUri: 'test',
                metadata: 'test'
            }
        })
    }

    updateOwner({tokenId, ownerAddress}: {tokenId: number, ownerAddress: string}) {
        return this.prisma.pixels.update({
            where: {tokenId},
            data: {
                ownerAddress
            }
        })
    }

    deleteAll() {
        return this.prisma.pixels.deleteMany()
    }
}

