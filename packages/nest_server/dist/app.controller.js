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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AppController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const pixels_service_1 = require("./pixels/pixels.service");
const ethers_1 = require("ethers");
const ethers_service_1 = require("./ethers/ethers.service");
const axios_1 = require("@nestjs/axios");
const pixels_repository_1 = require("./pixels/pixels.repository");
let AppController = AppController_1 = class AppController {
    constructor(pixelService, pixelsRepository, ethersService, httpService) {
        this.pixelService = pixelService;
        this.pixelsRepository = pixelsRepository;
        this.ethersService = ethersService;
        this.httpService = httpService;
        this.logger = new common_1.Logger(AppController_1.name);
    }
    getStatus() {
        return ('MUCH WOW\n' +
            '' +
            '░░░░░░░░░▄░░░░░░░░░░░░░░▄░░░░\n' +
            '░░░░░░░░▌▒█░░░░░░░░░░░▄▀▒▌░░░\n' +
            '░░░░░░░░▌▒▒█░░░░░░░░▄▀▒▒▒▐░░░\n' +
            '░░░░░░░▐▄▀▒▒▀▀▀▀▄▄▄▀▒▒▒▒▒▐░░░\n' +
            '░░░░░▄▄▀▒░▒▒▒▒▒▒▒▒▒█▒▒▄█▒▐░░░\n' +
            '░░░▄▀▒▒▒░░░▒▒▒░░░▒▒▒▀██▀▒▌░░░ \n' +
            '░░▐▒▒▒▄▄▒▒▒▒░░░▒▒▒▒▒▒▒▀▄▒▒▌░░\n' +
            '░░▌░░▌█▀▒▒▒▒▒▄▀█▄▒▒▒▒▒▒▒█▒▐░░\n' +
            '░▐░░░▒▒▒▒▒▒▒▒▌██▀▒▒░░░▒▒▒▀▄▌░\n' +
            '░▌░▒▄██▄▒▒▒▒▒▒▒▒▒░░░░░░▒▒▒▒▌░\n' +
            '▐▒▀▐▄█▄█▌▄░▀▒▒░░░░░░░░░░▒▒▒▐░\n' +
            '▐▒▒▐▀▐▀▒░▄▄▒▄▒▒▒▒▒▒░▒░▒░▒▒▒▒▌\n' +
            '▐▒▒▒▀▀▄▄▒▒▒▄▒▒▒▒▒▒▒▒░▒░▒░▒▒▐░\n' +
            '░▌▒▒▒▒▒▒▀▀▀▒▒▒▒▒▒░▒░▒░▒░▒▒▒▌░\n' +
            '░▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒░▒░▒░▒▒▄▒▒▐░░\n' +
            '░░▀▄▒▒▒▒▒▒▒▒▒▒▒░▒░▒░▒▄▒▒▒▒▌░░\n' +
            '░░░░▀▄▒▒▒▒▒▒▒▒▒▒▄▄▄▀▒▒▒▒▄▀░░░\n' +
            '░░░░░░▀▄▄▄▄▄▄▀▀▀▒▒▒▒▒▄▄▀░░░░░\n' +
            '░░░░░░░░░▒▒▒▒▒▒▒▒▒▒▀▀░░░░░░░░');
    }
    async getOwnershipConfig() {
        return this.pixelsRepository.getOwnershipMap();
    }
    async getConfigRefreshed() {
        await this.pixelService.syncTransfers();
        return this.pixelsRepository.getOwnershipMap();
    }
    async getPictureDimensions() {
        return this.pixelService.getDimensions();
    }
    async getPixelAddressBalance(params) {
        const balance = await this.pixelService.getPixelBalanceByAddress(params.address);
        return { balance: balance.toNumber() };
    }
    async getOwnerByTokenId(params) {
        const token = await this.pixelsRepository.findByTokenId(Number(params.tokenId));
        if (!token) {
            throw new Error('Could not find token');
        }
        return {
            address: token.ownerAddress,
        };
    }
    async getDogLocked() {
        const balance = await this.pixelService.getDogLocked();
        return {
            balance: ethers_1.ethers.utils.formatEther(balance),
        };
    }
    getContractAddresses() {
        return this.pixelService.getContractAddresses();
    }
    async getEnsAddress(params) {
        const ens = await this.ethersService.getEnsName(params.address);
        return { ens };
    }
    async getPixelMetadata(params) {
        const tokenUri = await this.pixelService.getPixelURI(params.tokenId);
        this.logger.log(tokenUri);
        const data = await this.httpService.get(tokenUri).toPromise();
        console.log(data.data);
        return true;
    }
};
__decorate([
    (0, common_1.Get)('status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getStatus", null);
__decorate([
    (0, common_1.Get)('config'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getOwnershipConfig", null);
__decorate([
    (0, common_1.Get)('config/refresh'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getConfigRefreshed", null);
__decorate([
    (0, common_1.Get)('px/dimensions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getPictureDimensions", null);
__decorate([
    (0, common_1.Get)('px/balance/:address'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getPixelAddressBalance", null);
__decorate([
    (0, common_1.Get)('px/owner/:tokenId'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getOwnerByTokenId", null);
__decorate([
    (0, common_1.Get)('dog/locked'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getDogLocked", null);
__decorate([
    (0, common_1.Get)('contract/addresses'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getContractAddresses", null);
__decorate([
    (0, common_1.Get)('ens/:address'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getEnsAddress", null);
__decorate([
    (0, common_1.Get)('px/metadata/:tokenId'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getPixelMetadata", null);
AppController = AppController_1 = __decorate([
    (0, common_1.Controller)('/v1'),
    __metadata("design:paramtypes", [pixels_service_1.PixelsService,
        pixels_repository_1.PixelsRepository,
        ethers_service_1.EthersService,
        axios_1.HttpService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map