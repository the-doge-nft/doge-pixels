import { PrismaService } from '../prisma.service';
export declare class PixelsRepository {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    findByTokenId(tokenId: number): import(".prisma/client").Prisma.Prisma__PixelsClient<import(".prisma/client").Pixels>;
    create({ from, to, tokenId }: {
        from: any;
        to: any;
        tokenId: any;
    }): import(".prisma/client").Prisma.Prisma__PixelsClient<import(".prisma/client").Pixels>;
    updateOwner({ tokenId, ownerAddress, }: {
        tokenId: number;
        ownerAddress: string;
    }): import(".prisma/client").Prisma.Prisma__PixelsClient<import(".prisma/client").Pixels>;
    deleteAll(): import(".prisma/client").PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
    getOwnershipMap(): Promise<{}>;
}
