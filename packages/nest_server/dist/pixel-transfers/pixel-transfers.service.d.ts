import { PrismaService } from '../prisma.service';
export declare class PixelTransfersService {
    private prisma;
    constructor(prisma: PrismaService);
    testInsert(): Promise<import(".prisma/client").PixelTransfers>;
}
