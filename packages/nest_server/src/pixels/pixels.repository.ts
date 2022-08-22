import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from "../prisma.service";
import {ethers} from "ethers";

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

    async getOwnershipMap() {
        const map = {}
        const data = await this.prisma.pixels.findMany()
        data.forEach(item => {
            if (map[item.ownerAddress]) {
                map[item.ownerAddress].push(item.tokenId)
            } else {
                map[item.ownerAddress] = [item.tokenId]
            }
        })
        // remove zero address for now
        delete map[ethers.constants.AddressZero]
        return map
    }
}

