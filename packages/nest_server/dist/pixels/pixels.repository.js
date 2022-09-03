"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PixelsRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PixelsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const ethers_1 = require("ethers");
let PixelsRepository = PixelsRepository_1 = class PixelsRepository {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(PixelsRepository_1.name);
    }
    findByTokenId(tokenId) {
        return this.prisma.pixels.findUnique({ where: { tokenId } });
    }
    create({ from, to, tokenId }) {
        return this.prisma.pixels.create({
            data: {
                ownerAddress: to,
                tokenId,
            },
        });
    }
    updateOwner({ tokenId, ownerAddress, }) {
        return this.prisma.pixels.update({
            where: { tokenId },
            data: {
                ownerAddress,
                updatedAt: new Date(),
            },
        });
    }
    deleteAll() {
        return this.prisma.pixels.deleteMany();
    }
    async getOwnershipMap() {
        const map = {};
        const data = await this.prisma.pixels.findMany();
        data.forEach((item) => {
            if (map[item.ownerAddress]) {
                map[item.ownerAddress].push(item.tokenId);
            }
            else {
                map[item.ownerAddress] = [item.tokenId];
            }
        });
        delete map[ethers_1.ethers.constants.AddressZero];
        return map;
    }
};
PixelsRepository = PixelsRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PixelsRepository);
exports.PixelsRepository = PixelsRepository;
//# sourceMappingURL=pixels.repository.js.map