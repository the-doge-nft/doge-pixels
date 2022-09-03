"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PixelTransferService = void 0;
class PixelTransferService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async transfers() {
        return this.prisma.pixelTransfers.findMany();
    }
}
exports.PixelTransferService = PixelTransferService;
//# sourceMappingURL=pixelTransfer.service.js.map