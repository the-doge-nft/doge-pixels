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
exports.PixelImageGeneratorService = void 0;
var common_1 = require("@nestjs/common");
var fs_1 = require("fs");
var canvas_1 = require("canvas");
var nestjs_sentry_1 = require("@travelerdev/nestjs-sentry");
var MintImage = require("../assets/images/mint.png");
var BurnImage = require("../assets/images/burn.png");
var Jimp = require('jimp');
var PixelImageGeneratorService = /** @class */ (function () {
    function PixelImageGeneratorService(pixels, ethers, config, sentryClient) {
        this.pixels = pixels;
        this.ethers = ethers;
        this.config = config;
        this.sentryClient = sentryClient;
        this.logger = new common_1.Logger(PixelImageGeneratorService_1.name);
        this.pixelOffsetX = 50;
        this.topPixeOffsetY = 20;
        this.bottomPixelOffsetY = 350;
        this.pixelWidth = 90;
        this.pixelHeight = 90;
        this.pixelTextHeight = 30;
        this.shadowWidth = 6;
    }
    PixelImageGeneratorService_1 = PixelImageGeneratorService;
    PixelImageGeneratorService.prototype.onModuleInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, Jimp.read(MintImage)];
                    case 1:
                        _a.mintedImage = _c.sent();
                        _b = this;
                        return [4 /*yield*/, Jimp.read(BurnImage)];
                    case 2:
                        _b.burnedImage = _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Generate Pixel image right drop shadow
     * @param {width of the drop shadow} width
     * @param {heigth of the drop shadow} height
     * @returns Jimp instance
     */
    PixelImageGeneratorService.prototype.generateShadow = function (width, height) {
        var blackNum = parseInt('000000' + 'ff', 16);
        var jimp = new Jimp(width, height);
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                jimp.setPixelColor(blackNum, x, y); // draw border
            }
        }
        return jimp;
    };
    /**
     * Generate Pixel image with WIDTH and HEIGTH based on the color
     * @param {color of Pixel image} color
     * @returns Jimp instance
     */
    PixelImageGeneratorService.prototype.generatePixelImage = function (color) {
        var hex = color.replace('#', '');
        var num = parseInt(hex + 'ff', 16);
        var blackNum = parseInt('000000' + 'ff', 16);
        var whiteNum = parseInt('fffced' + 'ff', 16);
        var jimp = new Jimp(this.pixelWidth, this.pixelHeight + this.pixelTextHeight);
        for (var x = 0; x < this.pixelWidth; x++) {
            for (var y = 0; y < this.pixelHeight + this.pixelTextHeight; y++) {
                if (x === 0 ||
                    x === this.pixelWidth - 1 ||
                    y === 0 ||
                    y === this.pixelHeight - 1) {
                    jimp.setPixelColor(blackNum, x, y); // draw border
                }
                else if (y < this.pixelHeight) {
                    jimp.setPixelColor(num, x, y); // draw pixel image
                }
                else {
                    jimp.setPixelColor(whiteNum, x, y); // draw white borad for coordinates
                }
            }
        }
        return jimp;
    };
    /**
     * Draw and fill the pointers
     * @param {canvas context} ctx
     * @param {x of the fist pointer} x
     * @param {y of the first pointer} y
     * @param {x of the second pointer} x1
     * @param {y of the second pointer} y1
     * @param {x of the third pointer} x2
     * @param {y of the third pointer} y2
     * @returns canvas context
     */
    PixelImageGeneratorService.prototype.drawPointer = function (ctx, x, y, x1, y1, x2, y2) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x, y);
        ctx.strokeStyle = '#000000';
        ctx.fillStyle = '#000000';
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
        return ctx;
    };
    /**
     * Creates pointer image for token
     * @param {token Id} tokenId
     */
    PixelImageGeneratorService.prototype.createPointerImage = function (tokenId) {
        var _this = this;
        try {
            var _a = this.pixels.pixelToCoordsLocal(tokenId), x = _a[0], y = _a[1];
            var _b = this.getPixelOffsets(y), pixelOffsetX = _b[0], pixelOffsetY = _b[1];
            var canvas = (0, canvas_1.createCanvas)(this.pixels.imageWidth, this.pixels.imageHeight);
            var context = canvas.getContext('2d');
            var y1 = void 0;
            if (pixelOffsetY === this.bottomPixelOffsetY) {
                y1 = this.bottomPixelOffsetY;
            }
            else {
                y1 = this.topPixeOffsetY + this.pixelHeight + this.pixelTextHeight;
            }
            this.drawPointer(context, x, y, pixelOffsetX + 20, y1, pixelOffsetX + 45, y1);
            var buffer_1 = canvas.toBuffer('image/png');
            return buffer_1;
            this.logger.log("starting to write file: ".concat(tokenId));
            return new Promise(function (resolve, _) {
                (0, fs_1.writeFile)("src/assets/images/pointer".concat(tokenId, ".png"), buffer_1, null, function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        this.logger.log("done writing file: ".concat(tokenId));
                        resolve('success');
                        return [2 /*return*/];
                    });
                }); });
            });
        }
        catch (error) {
            this.logger.error(error.message);
            this.sentryClient.instance().captureMessage(error);
        }
    };
    PixelImageGeneratorService.prototype.getPixelOffsets = function (y) {
        if (y <= this.pixels.imageHeight / 2) {
            return [this.pixelOffsetX, this.bottomPixelOffsetY];
        }
        else {
            return [this.pixelOffsetX, this.topPixeOffsetY];
        }
    };
    PixelImageGeneratorService.prototype.getTextContent = function (from, to, tokenId) {
        return __awaiter(this, void 0, void 0, function () {
            var action, address, ens, _a, x, y, content;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(from === this.ethers.zeroAddress || to === this.ethers.zeroAddress)) return [3 /*break*/, 2];
                        action = from === this.ethers.zeroAddress ? 'minted' : 'burned';
                        address = from === this.ethers.zeroAddress ? to : from;
                        return [4 /*yield*/, this.ethers.getEnsName(address)];
                    case 1:
                        ens = _b.sent();
                        _a = this.pixels.pixelToCoordsLocal(tokenId), x = _a[0], y = _a[1];
                        content = "Pixel (".concat(x, ", ").concat(y, ") ").concat(action, " by ").concat(ens ? ens : address, "\n");
                        content += "".concat(this.config.get('isProd')
                            ? 'pixels.ownthedoge.com'
                            : 'dev.pixels.ownthedoge.com', "/px/").concat(tokenId);
                        return [2 /*return*/, content];
                    case 2:
                        this.logger.log("Transfer was not a burn or mint event -- error out");
                        throw new Error('Should not be called');
                }
            });
        });
    };
    PixelImageGeneratorService.prototype.generatePostImage = function (mintOrBurn, tokenId) {
        return __awaiter(this, void 0, void 0, function () {
            var pointerBuffer, pointerImg, _a, x, y, color, backgroundImage, image, pixelImage, _b, pixelOffsetX, pixelOffsetY, rightShadow, bottomShadow, font;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.createPointerImage(tokenId)];
                    case 1:
                        pointerBuffer = _c.sent();
                        return [4 /*yield*/, Jimp.read(pointerBuffer)];
                    case 2:
                        pointerImg = _c.sent();
                        _a = this.pixels.pixelToCoordsLocal(tokenId), x = _a[0], y = _a[1];
                        color = this.pixels.pixelToHexLocal(tokenId);
                        return [4 /*yield*/, Jimp.read('src/assets/images/background.png')];
                    case 3:
                        backgroundImage = _c.sent();
                        image = backgroundImage.composite(pointerImg, 0, 0);
                        pixelImage = this.generatePixelImage(color);
                        _b = this.getPixelOffsets(y), pixelOffsetX = _b[0], pixelOffsetY = _b[1];
                        image = image.composite(pixelImage, pixelOffsetX, pixelOffsetY);
                        rightShadow = this.generateShadow(this.shadowWidth, this.pixelHeight + this.pixelTextHeight);
                        image = image.composite(rightShadow, pixelOffsetX + this.pixelWidth, pixelOffsetY + this.shadowWidth);
                        bottomShadow = this.generateShadow(this.pixelWidth - this.shadowWidth, this.shadowWidth);
                        image = image.composite(bottomShadow, pixelOffsetX + this.shadowWidth, pixelOffsetY + this.pixelHeight + this.pixelTextHeight);
                        // merge minted text image with background image
                        image = image.composite(mintOrBurn === 'mint' ? this.mintedImage : this.burnedImage, 400, 430);
                        return [4 /*yield*/, Jimp.loadFont('src/assets/fonts/PressStart2P-Regular.ttf.fnt')];
                    case 4:
                        font = _c.sent();
                        image.print(font, pixelOffsetX + 5, pixelOffsetY + this.pixelHeight + 10, "(".concat(x, ",").concat(y, ")"));
                        // const base64image = await image.getBase64Async('image/png');
                        // return base64image.replace('data:image/png;base64,', '');
                        return [2 /*return*/, image];
                }
            });
        });
    };
    var PixelImageGeneratorService_1;
    PixelImageGeneratorService = PixelImageGeneratorService_1 = __decorate([
        (0, common_1.Injectable)(),
        __param(3, (0, nestjs_sentry_1.InjectSentry)())
    ], PixelImageGeneratorService);
    return PixelImageGeneratorService;
}());
exports.PixelImageGeneratorService = PixelImageGeneratorService;
