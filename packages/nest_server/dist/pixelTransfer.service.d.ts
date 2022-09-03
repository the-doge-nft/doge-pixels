import { PrismaService } from './prisma.service';
export declare class PixelTransferService {
    private prisma;
    constructor(prisma: PrismaService);
    transfers(): Promise<import(".prisma/client").PixelTransfers[]>;
}
