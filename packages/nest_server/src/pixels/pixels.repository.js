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
exports.PixelsRepository = void 0;
var common_1 = require("@nestjs/common");
var ethers_1 = require("ethers");
var PixelsRepository = /** @class */ (function () {
    function PixelsRepository(prisma, ethers, cacheManager) {
        this.prisma = prisma;
        this.ethers = ethers;
        this.cacheManager = cacheManager;
        this.logger = new common_1.Logger(PixelsRepository_1.name);
    }
    PixelsRepository_1 = PixelsRepository;
    PixelsRepository.prototype.findByTokenId = function (tokenId) {
        return this.prisma.pixels.findUnique({ where: { tokenId: tokenId } });
    };
    PixelsRepository.prototype.create = function (_a) {
        var from = _a.from, to = _a.to, tokenId = _a.tokenId;
        return this.prisma.pixels.create({
            data: {
                ownerAddress: to,
                tokenId: tokenId
            }
        });
    };
    PixelsRepository.prototype.updateOwner = function (_a) {
        var tokenId = _a.tokenId, ownerAddress = _a.ownerAddress;
        return this.prisma.pixels.update({
            where: { tokenId: tokenId },
            data: {
                ownerAddress: ownerAddress,
                updatedAt: new Date()
            }
        });
    };
    PixelsRepository.prototype.deleteAll = function () {
        return this.prisma.pixels.deleteMany();
    };
    PixelsRepository.prototype.getOwnershipMap = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var map, data, _i, data_1, item, cacheKey, ens;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        map = {};
                        return [4 /*yield*/, this.prisma.pixels.findMany()];
                    case 1:
                        data = _b.sent();
                        _i = 0, data_1 = data;
                        _b.label = 2;
                    case 2:
                        if (!(_i < data_1.length)) return [3 /*break*/, 9];
                        item = data_1[_i];
                        if (!((_a = map[item.ownerAddress]) === null || _a === void 0 ? void 0 : _a.tokenIds)) return [3 /*break*/, 3];
                        map[item.ownerAddress].tokenIds.push(item.tokenId);
                        return [3 /*break*/, 8];
                    case 3:
                        cacheKey = "ens:".concat(item.ownerAddress);
                        return [4 /*yield*/, this.cacheManager.get(cacheKey)];
                    case 4:
                        ens = _b.sent();
                        if (!!ens) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.ethers.getEnsName(item.ownerAddress)];
                    case 5:
                        ens = _b.sent();
                        if (!ens) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.cacheManager.set(cacheKey, ens, { ttl: 60000 * 60 })];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7:
                        map[item.ownerAddress] = {
                            tokenIds: [item.tokenId],
                            ens: ens
                        };
                        _b.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 2];
                    case 9:
                        // remove zero address for now
                        delete map[ethers_1.ethers.constants.AddressZero];
                        return [2 /*return*/, map];
                }
            });
        });
    };
    var PixelsRepository_1;
    PixelsRepository = PixelsRepository_1 = __decorate([
        (0, common_1.Injectable)(),
        __param(2, (0, common_1.Inject)(common_1.CACHE_MANAGER))
    ], PixelsRepository);
    return PixelsRepository;
}());
exports.PixelsRepository = PixelsRepository;
