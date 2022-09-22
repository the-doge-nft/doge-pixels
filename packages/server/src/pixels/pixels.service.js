"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.PixelsService = void 0;
var common_1 = require("@nestjs/common");
var event_emitter_1 = require("@nestjs/event-emitter");
var events_1 = require("../events");
var ethers_1 = require("ethers");
var ABI = require("../contracts/hardhat_contracts.json");
var KobosuJson = require("../assets/images/kobosu.json");
var nestjs_sentry_1 = require("@travelerdev/nestjs-sentry");
var PixelsService = /** @class */ (function () {
    function PixelsService(ethersService, configService, pixelsRepository, eventEmitter, sentryClient) {
        this.ethersService = ethersService;
        this.configService = configService;
        this.pixelsRepository = pixelsRepository;
        this.eventEmitter = eventEmitter;
        this.sentryClient = sentryClient;
        this.logger = new common_1.Logger(PixelsService_1.name);
        this.imageWidth = 640;
        this.imageHeight = 480;
        this.pixelToIDOffset = 1000000;
    }
    PixelsService_1 = PixelsService;
    PixelsService.prototype.onModuleInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.pxContract && !this.dogContract && this.ethersService.provider) {
                    this.initContracts(this.ethersService.provider);
                }
                return [2 /*return*/];
            });
        });
    };
    PixelsService.prototype.handleProviderConnected = function (provider) {
        return __awaiter(this, void 0, void 0, function () {
            var logMessage;
            return __generator(this, function (_a) {
                logMessage = 'Infura provider re-connected';
                this.logger.log(logMessage);
                this.sentryClient.instance().captureMessage(logMessage);
                this.initContracts(provider);
                return [2 /*return*/];
            });
        });
    };
    PixelsService.prototype.initContracts = function (provider) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connectToContracts(provider)];
                    case 1:
                        _a.sent();
                        this.initPixelListener();
                        this.syncTransfers();
                        return [2 /*return*/];
                }
            });
        });
    };
    PixelsService.prototype.connectToContracts = function (provider) {
        return __awaiter(this, void 0, void 0, function () {
            var chainId, pxContractInfo, dogContractInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, provider.getNetwork()];
                    case 1:
                        chainId = (_a.sent()).chainId;
                        pxContractInfo = ABI[chainId][this.ethersService.network].contracts['PX'];
                        dogContractInfo = ABI[chainId][this.ethersService.network].contracts['DOG20'];
                        this.pxContract = new ethers_1.ethers.Contract(pxContractInfo.address, pxContractInfo.abi, provider);
                        this.dogContract = new ethers_1.ethers.Contract(dogContractInfo.address, dogContractInfo.abi, provider);
                        return [2 /*return*/];
                }
            });
        });
    };
    PixelsService.prototype.initPixelListener = function () {
        var _this = this;
        this.pxContract.on('Transfer', function (from, to, tokenId, event) { return __awaiter(_this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                this.logger.log("new transfer event hit: ".concat(from, " -- ").concat(to, " -- ").concat(tokenId));
                payload = { from: from, to: to, tokenId: tokenId };
                this.eventEmitter.emit(events_1.Events.PIXEL_MINT_OR_BURN, payload);
                this.pixelsRepository.updateOwner({ tokenId: tokenId, ownerAddress: to });
                return [2 /*return*/];
            });
        }); });
    };
    PixelsService.prototype.syncTransfers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var logs, _i, logs_1, log, txHash, args, from, to, tokenId, pixel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAllPixelTransferLogs()];
                    case 1:
                        logs = _a.sent();
                        _i = 0, logs_1 = logs;
                        _a.label = 2;
                    case 2:
                        if (!(_i < logs_1.length)) return [3 /*break*/, 8];
                        log = logs_1[_i];
                        txHash = log.transactionHash, args = log.args;
                        from = args.from, to = args.to, tokenId = args.tokenId;
                        return [4 /*yield*/, this.pixelsRepository.findByTokenId(tokenId.toNumber())];
                    case 3:
                        pixel = _a.sent();
                        if (!!pixel) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.pixelsRepository.create({
                                from: from,
                                to: to,
                                tokenId: tokenId.toNumber()
                            })];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, this.pixelsRepository.updateOwner({
                            tokenId: tokenId.toNumber(),
                            ownerAddress: to
                        })];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 2];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    PixelsService.prototype.getAllPixelTransferLogs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var filter, fromBlock, toBlock, logs, step, i, _logs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filter = this.pxContract.filters.Transfer(null, null);
                        fromBlock = this.configService.get('pixelContractDeploymentBlockNumber');
                        return [4 /*yield*/, this.ethersService.provider.getBlockNumber()];
                    case 1:
                        toBlock = _a.sent();
                        logs = [];
                        step = 5000;
                        i = fromBlock;
                        _a.label = 2;
                    case 2:
                        if (!(i <= toBlock)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.pxContract.queryFilter(filter, i, i + step)];
                    case 3:
                        _logs = _a.sent();
                        logs.push.apply(logs, _logs);
                        _a.label = 4;
                    case 4:
                        i += step + 1;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, logs];
                }
            });
        });
    };
    PixelsService.prototype.getDogLocked = function () {
        return this.dogContract.balanceOf(this.pxContract.address);
    };
    PixelsService.prototype.getContractAddresses = function () {
        return {
            dog: this.dogContract.address,
            pixel: this.pxContract.address
        };
    };
    PixelsService.prototype.getPixelURI = function (tokenId) {
        return this.pxContract.tokenURI(tokenId);
    };
    PixelsService.prototype.getDimensions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var width, height;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pxContract.SHIBA_WIDTH()];
                    case 1:
                        width = _a.sent();
                        return [4 /*yield*/, this.pxContract.SHIBA_HEIGHT()];
                    case 2:
                        height = _a.sent();
                        return [2 /*return*/, {
                                width: width.toNumber(),
                                height: height.toNumber()
                            }];
                }
            });
        });
    };
    PixelsService.prototype.getPixelBalanceByAddress = function (address) {
        return this.pxContract.balanceOf(address);
    };
    PixelsService.prototype.pixelToIndexLocal = function (pixel) {
        return pixel - this.pixelToIDOffset;
    };
    PixelsService.prototype.pixelToCoordsLocal = function (pixel) {
        var index = this.pixelToIndexLocal(pixel);
        return [index % this.imageWidth, Math.floor(index / this.imageWidth)];
    };
    PixelsService.prototype.pixelToHexLocal = function (pixel) {
        var _a = this.pixelToCoordsLocal(pixel), x = _a[0], y = _a[1];
        return KobosuJson[y][x];
    };
    var PixelsService_1;
    __decorate([
        (0, event_emitter_1.OnEvent)(events_1.Events.ETHERS_WS_PROVIDER_CONNECTED)
    ], PixelsService.prototype, "handleProviderConnected");
    PixelsService = PixelsService_1 = __decorate([
        (0, common_1.Injectable)(),
        __param(4, (0, nestjs_sentry_1.InjectSentry)())
    ], PixelsService);
    return PixelsService;
}());
exports.PixelsService = PixelsService;
