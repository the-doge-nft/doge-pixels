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
exports.TwitterService = void 0;
var common_1 = require("@nestjs/common");
var event_emitter_1 = require("@nestjs/event-emitter");
var events_1 = require("../events");
var nestjs_sentry_1 = require("@travelerdev/nestjs-sentry");
var Twitter = require("twitter");
var TwitterService = /** @class */ (function () {
    function TwitterService(config, imageGenerator, ethers, sentryClient) {
        this.config = config;
        this.imageGenerator = imageGenerator;
        this.ethers = ethers;
        this.sentryClient = sentryClient;
        this.logger = new common_1.Logger(TwitterService_1.name);
    }
    TwitterService_1 = TwitterService;
    TwitterService.prototype.onModuleInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.client = new Twitter({
                    consumer_key: this.config.get('twitter').consumerKey,
                    consumer_secret: this.config.get('twitter').consumerSecret,
                    access_token_key: this.config.get('twitter').accessToken,
                    access_token_secret: this.config.get('twitter').secret
                });
                return [2 /*return*/];
            });
        });
    };
    TwitterService.prototype.tweetPixelEventImage = function (_a) {
        var from = _a.from, to = _a.to, tokenId = _a.tokenId;
        return __awaiter(this, void 0, void 0, function () {
            var textContent, image, base64Image, mediaId;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.logger.log("Posting to twitter:: (".concat(tokenId, ") ").concat(from, " -> ").concat(to));
                        return [4 /*yield*/, this.imageGenerator.getTextContent(from, to, tokenId)];
                    case 1:
                        textContent = _b.sent();
                        return [4 /*yield*/, this.imageGenerator.generatePostImage(from === this.ethers.zeroAddress ? 'mint' : 'burn', tokenId)];
                    case 2:
                        image = _b.sent();
                        return [4 /*yield*/, image.getBase64Async('image/png')];
                    case 3:
                        base64Image = _b.sent();
                        base64Image = base64Image.replace('data:image/png;base64,', '');
                        return [4 /*yield*/, this.uploadImageToTwitter(base64Image)];
                    case 4:
                        mediaId = _b.sent();
                        return [4 /*yield*/, this.tweet(mediaId, textContent)];
                    case 5:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TwitterService.prototype.uploadImageToTwitter = function (mediaData) {
        var _this = this;
        return new Promise(function (resolve, _) {
            _this.client.post('media/upload', { media_data: mediaData }, function (err, data, _) {
                if (!err) {
                    return resolve(data.media_id_string);
                }
                else {
                    _this.logger.error(JSON.stringify(err));
                    _this.sentryClient.instance().captureException(err);
                }
            });
        });
    };
    TwitterService.prototype.tweet = function (media_id, status) {
        var _this = this;
        return this.client.post('statuses/update', {
            status: status,
            media_ids: media_id
        }, function (err) {
            if (err) {
                _this.logger.error("Error occurred tweeting status: ".concat(JSON.stringify(err)));
            }
        });
    };
    TwitterService.prototype.DEBUG_TEST = function () {
        if (this.config.get('isDev')) {
            return this.tweetPixelEventImage({
                from: '0x0000000000000000000000000000000000000000',
                to: '0xd801d86C10e2185a8FCBccFB7D7baF0A6C5B6BD5',
                tokenId: 1191008
            });
        }
        else {
            this.logger.log("".concat(arguments.callee.name, " only available in development mode"));
        }
    };
    var TwitterService_1;
    __decorate([
        (0, event_emitter_1.OnEvent)(events_1.Events.PIXEL_MINT_OR_BURN)
    ], TwitterService.prototype, "tweetPixelEventImage");
    TwitterService = TwitterService_1 = __decorate([
        (0, common_1.Injectable)(),
        __param(3, (0, nestjs_sentry_1.InjectSentry)())
    ], TwitterService);
    return TwitterService;
}());
exports.TwitterService = TwitterService;
