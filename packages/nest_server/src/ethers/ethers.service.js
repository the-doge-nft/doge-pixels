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
exports.__esModule = true;
exports.EthersService = void 0;
var common_1 = require("@nestjs/common");
var ethers_1 = require("ethers");
var events_1 = require("../events");
var configuration_1 = require("../config/configuration");
var nestjs_sentry_1 = require("@travelerdev/nestjs-sentry");
var EthersService = /** @class */ (function () {
    function EthersService(configService, eventEmitter, sentryClient) {
        this.configService = configService;
        this.eventEmitter = eventEmitter;
        this.sentryClient = sentryClient;
        this.logger = new common_1.Logger(EthersService_1.name);
        this.zeroAddress = ethers_1.ethers.constants.AddressZero;
        var appEnv = this.configService.get('appEnv');
        if (appEnv === configuration_1.AppEnv.production) {
            this.network = 'mainnet';
        }
        else if (appEnv === configuration_1.AppEnv.development || appEnv === configuration_1.AppEnv.staging) {
            this.network = 'rinkeby';
        }
        else if (appEnv === configuration_1.AppEnv.test) {
            this.network = 'localhost';
        }
        else {
            throw new Error('App environment unknown');
        }
    }
    EthersService_1 = EthersService;
    EthersService.prototype.onModuleInit = function () {
        this.initWS();
    };
    EthersService.prototype.initWS = function () {
        var _this = this;
        var logMessage = "Creating WS provider on network: ".concat(this.network);
        this.logger.log(logMessage);
        this.sentryClient.instance().captureMessage(logMessage);
        if (this.configService.get('appEnv') === configuration_1.AppEnv.test) {
            this.provider = new ethers_1.ethers.providers.WebSocketProvider("ws://127.0.0.1:8545");
        }
        else {
            this.provider = new ethers_1.ethers.providers.WebSocketProvider(this.configService.get('infura').wsEndpoint, this.network);
        }
        this.eventEmitter.emit(events_1.Events.ETHERS_WS_PROVIDER_CONNECTED, this.provider);
        if (this.configService.get('appEnv') !== configuration_1.AppEnv.test) {
            this.keepAlive({
                provider: this.provider,
                onDisconnect: function () {
                    _this.initWS();
                }
            });
        }
    };
    // the ws connection from infura often drops which we *cannot* have happen
    // as we need to be listening to contract events at all times
    EthersService.prototype.keepAlive = function (_a) {
        var _this = this;
        var provider = _a.provider, onDisconnect = _a.onDisconnect, _b = _a.expectedPongBack, expectedPongBack = _b === void 0 ? 15000 : _b, _c = _a.checkInterval, checkInterval = _c === void 0 ? 7500 : _c;
        var pingTimeout;
        var keepAliveInterval;
        provider._websocket.on('open', function () {
            keepAliveInterval = setInterval(function () {
                provider._websocket.ping();
                pingTimeout = setTimeout(function () {
                    provider._websocket.terminate();
                }, expectedPongBack);
            }, checkInterval);
        });
        provider._websocket.on('close', function (err) {
            var logMessage = 'Websocket connection closed';
            _this.logger.error(logMessage);
            _this.sentryClient.instance().captureMessage(logMessage);
            if (keepAliveInterval) {
                clearInterval(keepAliveInterval);
            }
            if (pingTimeout) {
                clearTimeout(pingTimeout);
            }
            onDisconnect(err);
        });
        provider._websocket.on('pong', function () {
            if (pingTimeout) {
                clearTimeout(pingTimeout);
            }
        });
    };
    EthersService.prototype.getEnsName = function (address) {
        return this.provider.lookupAddress(address);
    };
    var EthersService_1;
    EthersService = EthersService_1 = __decorate([
        (0, common_1.Injectable)(),
        __param(2, (0, nestjs_sentry_1.InjectSentry)())
    ], EthersService);
    return EthersService;
}());
exports.EthersService = EthersService;
