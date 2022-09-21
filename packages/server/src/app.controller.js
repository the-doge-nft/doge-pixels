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
exports.AppController = void 0;
var common_1 = require("@nestjs/common");
var ethers_1 = require("ethers");
var AppController = /** @class */ (function () {
    function AppController(pixelService, pixelsRepository, ethersService, httpService, nomics, twitter, discord, config, cacheManager) {
        this.pixelService = pixelService;
        this.pixelsRepository = pixelsRepository;
        this.ethersService = ethersService;
        this.httpService = httpService;
        this.nomics = nomics;
        this.twitter = twitter;
        this.discord = discord;
        this.config = config;
        this.cacheManager = cacheManager;
        this.logger = new common_1.Logger(AppController_1.name);
    }
    AppController_1 = AppController;
    AppController.prototype.getStatus = function () {
        return ('WOW\n' +
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
    };
    AppController.prototype.getOwnershipConfig = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.pixelsRepository.getOwnershipMap()];
            });
        });
    };
    AppController.prototype.getConfigRefreshed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pixelService.syncTransfers()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.pixelsRepository.getOwnershipMap()];
                }
            });
        });
    };
    AppController.prototype.getPictureDimensions = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.pixelService.getDimensions()];
            });
        });
    };
    AppController.prototype.getPixelAddressBalance = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var balance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pixelService.getPixelBalanceByAddress(params.address)];
                    case 1:
                        balance = _a.sent();
                        return [2 /*return*/, { balance: balance.toNumber() }];
                }
            });
        });
    };
    AppController.prototype.getOwnerByTokenId = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pixelsRepository.findByTokenId(Number(params.tokenId))];
                    case 1:
                        token = _a.sent();
                        if (!token) {
                            throw new common_1.BadRequestException('Could not find token');
                        }
                        return [2 /*return*/, {
                                address: token.ownerAddress
                            }];
                }
            });
        });
    };
    AppController.prototype.getDogLocked = function () {
        return __awaiter(this, void 0, void 0, function () {
            var balance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pixelService.getDogLocked()];
                    case 1:
                        balance = _a.sent();
                        return [2 /*return*/, {
                                balance: ethers_1.ethers.utils.formatEther(balance)
                            }];
                }
            });
        });
    };
    AppController.prototype.getContractAddresses = function () {
        return this.pixelService.getContractAddresses();
    };
    AppController.prototype.getEnsAddress = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var ens;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ethersService.getEnsName(params.address)];
                    case 1:
                        ens = _a.sent();
                        return [2 /*return*/, { ens: ens }];
                }
            });
        });
    };
    AppController.prototype.getPixelMetadata = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenId, cacheKey, tokenNotMintedMessage, cache, tokenUri, data, e_1, tokenNotMintedErrorString, errorMessage, isTokenNotMinted;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenId = params.tokenId;
                        cacheKey = "METADATA:".concat(tokenId);
                        tokenNotMintedMessage = 'NOT_MINTED';
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, , 12]);
                        return [4 /*yield*/, this.cacheManager.get(cacheKey)];
                    case 2:
                        cache = _a.sent();
                        if (!(cache === tokenNotMintedMessage)) return [3 /*break*/, 3];
                        this.logger.log(tokenNotMintedMessage);
                        throw new Error(tokenNotMintedMessage);
                    case 3: return [4 /*yield*/, this.pixelService.getPixelURI(params.tokenId)];
                    case 4:
                        tokenUri = _a.sent();
                        return [4 /*yield*/, this.httpService.get(tokenUri).toPromise()];
                    case 5:
                        data = (_a.sent()).data;
                        this.logger.log("got metadata, setting to cache: ".concat(JSON.stringify(data)));
                        return [4 /*yield*/, this.cacheManager.set(cacheKey, data)];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, data];
                    case 7: return [3 /*break*/, 12];
                    case 8:
                        e_1 = _a.sent();
                        if (!(e_1.message === tokenNotMintedMessage)) return [3 /*break*/, 9];
                        this.logger.log('known non-minted token, continuing');
                        return [3 /*break*/, 11];
                    case 9:
                        tokenNotMintedErrorString = "ERC721Metadata: URI query for nonexistent token";
                        this.logger.log("GOT ERROR: ".concat(JSON.stringify(e_1)));
                        errorMessage = e_1.reason;
                        isTokenNotMinted = errorMessage === tokenNotMintedErrorString;
                        if (!isTokenNotMinted) return [3 /*break*/, 11];
                        this.logger.log("non minted token hit. setting cache to not-minted");
                        return [4 /*yield*/, this.cacheManager.set(cacheKey, tokenNotMintedMessage)];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11: throw new common_1.BadRequestException('Could not get metadata');
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    AppController.prototype.getPixelUSDPrice = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, usdPrice, dogPerPixel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.nomics.getDOGPrice()];
                    case 1:
                        data = (_a.sent()).data;
                        usdPrice = Number(data[0].price);
                        dogPerPixel = 55239.89899;
                        return [2 /*return*/, {
                                price: usdPrice * dogPerPixel
                            }];
                }
            });
        });
    };
    AppController.prototype.getTwitterBotTest = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.config.get('isDev')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.twitter.DEBUG_TEST()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { success: true }];
                    case 2: return [2 /*return*/, { success: false }];
                }
            });
        });
    };
    AppController.prototype.getDiscordBotTest = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.config.get('isDev')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.discord.DEBUG_TEST()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { success: true }];
                    case 2: return [2 /*return*/, { success: false }];
                }
            });
        });
    };
    var AppController_1;
    __decorate([
        (0, common_1.Get)('status')
    ], AppController.prototype, "getStatus");
    __decorate([
        (0, common_1.Get)('config')
    ], AppController.prototype, "getOwnershipConfig");
    __decorate([
        (0, common_1.Get)('config/refresh')
    ], AppController.prototype, "getConfigRefreshed");
    __decorate([
        (0, common_1.Get)('px/dimensions')
    ], AppController.prototype, "getPictureDimensions");
    __decorate([
        (0, common_1.Get)('px/balance/:address'),
        __param(0, (0, common_1.Param)())
    ], AppController.prototype, "getPixelAddressBalance");
    __decorate([
        (0, common_1.Get)('px/owner/:tokenId'),
        __param(0, (0, common_1.Param)())
    ], AppController.prototype, "getOwnerByTokenId");
    __decorate([
        (0, common_1.Get)('dog/locked')
    ], AppController.prototype, "getDogLocked");
    __decorate([
        (0, common_1.Get)('contract/addresses')
    ], AppController.prototype, "getContractAddresses");
    __decorate([
        (0, common_1.Get)('ens/:address'),
        __param(0, (0, common_1.Param)())
    ], AppController.prototype, "getEnsAddress");
    __decorate([
        (0, common_1.Get)('px/metadata/:tokenId'),
        __param(0, (0, common_1.Param)())
    ], AppController.prototype, "getPixelMetadata");
    __decorate([
        (0, common_1.Get)('px/price')
    ], AppController.prototype, "getPixelUSDPrice");
    __decorate([
        (0, common_1.Get)('twitter/test')
    ], AppController.prototype, "getTwitterBotTest");
    __decorate([
        (0, common_1.Get)('discord/test')
    ], AppController.prototype, "getDiscordBotTest");
    AppController = AppController_1 = __decorate([
        (0, common_1.Controller)('/v1'),
        __param(8, (0, common_1.Inject)(common_1.CACHE_MANAGER))
    ], AppController);
    return AppController;
}());
exports.AppController = AppController;
