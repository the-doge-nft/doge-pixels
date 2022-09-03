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
var PixelsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PixelsService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const events_1 = require("../events");
const ethers_1 = require("ethers");
const ethers_service_1 = require("../ethers/ethers.service");
const ABI = require("../contracts/hardhat_contracts.json");
const config_1 = require("@nestjs/config");
const pixels_repository_1 = require("./pixels.repository");
const nestjs_sentry_1 = require("@ntegral/nestjs-sentry");
let PixelsService = PixelsService_1 = class PixelsService {
    constructor(ethersService, configService, pixelsRepository, sentryClient) {
        this.ethersService = ethersService;
        this.configService = configService;
        this.pixelsRepository = pixelsRepository;
        this.sentryClient = sentryClient;
        this.logger = new common_1.Logger(PixelsService_1.name);
    }
    async onModuleInit() {
        if (!this.pxContract && !this.dogContract && this.ethersService.provider) {
            this.initContracts(this.ethersService.provider);
        }
    }
    async handleProviderConnected(provider) {
        const logMessage = 'Infura provider re-connected';
        this.logger.log(logMessage);
        this.sentryClient.instance().captureMessage(logMessage);
        this.initContracts(provider);
    }
    async initContracts(provider) {
        await this.connectToContracts(provider);
        this.initPixelListener();
        this.syncTransfers();
    }
    async connectToContracts(provider) {
        const { chainId } = await provider.getNetwork();
        const pxContractInfo = ABI[chainId][this.ethersService.network].contracts['PX'];
        const dogContractInfo = ABI[chainId][this.ethersService.network].contracts['DOG20'];
        this.pxContract = new ethers_1.ethers.Contract(pxContractInfo.address, pxContractInfo.abi, provider);
        this.dogContract = new ethers_1.ethers.Contract(dogContractInfo.address, dogContractInfo.abi, provider);
    }
    initPixelListener() {
        this.pxContract.on('Transfer', async (from, to, tokenId, event) => {
            this.logger.log(`new transfer event hit: ${from} -- ${to} -- ${tokenId}`);
            this.pixelsRepository.updateOwner({ tokenId, ownerAddress: to });
        });
    }
    async syncTransfers() {
        const logs = await this.getAllPixelTransferLogs();
        for (const log of logs) {
            const { transactionHash: txHash, args } = log;
            const { from, to, tokenId } = args;
            const pixel = await this.pixelsRepository.findByTokenId(tokenId.toNumber());
            if (!pixel) {
                await this.pixelsRepository.create({
                    from,
                    to,
                    tokenId: tokenId.toNumber(),
                });
            }
            else {
                await this.pixelsRepository.updateOwner({
                    tokenId: tokenId.toNumber(),
                    ownerAddress: to,
                });
            }
        }
    }
    async getAllPixelTransferLogs() {
        const filter = this.pxContract.filters.Transfer(null, null);
        const fromBlock = this.configService.get('pixelContractDeploymentBlockNumber');
        const toBlock = await this.ethersService.provider.getBlockNumber();
        const logs = [];
        const step = 5000;
        for (let i = fromBlock; i <= toBlock; i += step + 1) {
            const _logs = await this.pxContract.queryFilter(filter, i, i + step);
            logs.push(..._logs);
        }
        return logs;
    }
    getDogLocked() {
        return this.dogContract.balanceOf(this.pxContract.address);
    }
    getContractAddresses() {
        return {
            dog: this.dogContract.address,
            pixel: this.pxContract.address,
        };
    }
    getPixelURI(tokenId) {
        return this.pxContract.tokenURI(tokenId);
    }
    async getDimensions() {
        const width = await this.pxContract.SHIBA_WIDTH();
        const height = await this.pxContract.SHIBA_HEIGHT();
        return {
            widht: width.toNumber(),
            height: height.toNumber(),
        };
    }
    getPixelBalanceByAddress(address) {
        return this.pxContract.balanceOf(address);
    }
};
__decorate([
    (0, event_emitter_1.OnEvent)(events_1.Events.ETHERS_WS_PROVIDER_CONNECTED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ethers_1.ethers.providers.WebSocketProvider]),
    __metadata("design:returntype", Promise)
], PixelsService.prototype, "handleProviderConnected", null);
PixelsService = PixelsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, nestjs_sentry_1.InjectSentry)()),
    __metadata("design:paramtypes", [ethers_service_1.EthersService,
        config_1.ConfigService,
        pixels_repository_1.PixelsRepository,
        nestjs_sentry_1.SentryService])
], PixelsService);
exports.PixelsService = PixelsService;
//# sourceMappingURL=pixels.service.js.map