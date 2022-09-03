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
var EthersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthersService = void 0;
const common_1 = require("@nestjs/common");
const ethers_1 = require("ethers");
const config_1 = require("@nestjs/config");
const event_emitter_1 = require("@nestjs/event-emitter");
const events_1 = require("../events");
const nestjs_sentry_1 = require("@ntegral/nestjs-sentry");
const configuration_1 = require("../config/configuration");
let EthersService = EthersService_1 = class EthersService {
    constructor(configService, eventEmitter, sentryClient) {
        this.configService = configService;
        this.eventEmitter = eventEmitter;
        this.sentryClient = sentryClient;
        this.logger = new common_1.Logger(EthersService_1.name);
        const appEnv = this.configService.get('appEnv');
        if (appEnv === 'production') {
            this.network = 'mainnet';
        }
        else if (appEnv === 'development') {
            this.network = 'rinkeby';
        }
        else if (appEnv === 'test') {
            this.network = 'localhost';
        }
        else {
            throw new Error('App environment unknown');
        }
    }
    onModuleInit() {
        this.initWS();
    }
    initWS() {
        const logMessage = `Creating WS provider on network: ${this.network}`;
        this.logger.log(logMessage);
        this.sentryClient.instance().captureMessage(logMessage);
        if (this.configService.get('appEnv') === configuration_1.AppEnv.test) {
            this.provider = new ethers_1.ethers.providers.WebSocketProvider(`ws://127.0.0.1:8545`);
        }
        else {
            this.provider = new ethers_1.ethers.providers.WebSocketProvider(this.configService.get('infura').wsEndpoint, this.network);
        }
        this.eventEmitter.emit(events_1.Events.ETHERS_WS_PROVIDER_CONNECTED, this.provider);
        if (this.configService.get('appEnv') !== configuration_1.AppEnv.test) {
            this.keepAlive({
                provider: this.provider,
                onDisconnect: () => {
                    this.initWS();
                },
            });
        }
    }
    keepAlive({ provider, onDisconnect, expectedPongBack = 15000, checkInterval = 7500, }) {
        let pingTimeout;
        let keepAliveInterval;
        provider._websocket.on('open', () => {
            keepAliveInterval = setInterval(() => {
                provider._websocket.ping();
                pingTimeout = setTimeout(() => {
                    provider._websocket.terminate();
                }, expectedPongBack);
            }, checkInterval);
        });
        provider._websocket.on('close', (err) => {
            const logMessage = 'Websocket connection closed';
            this.logger.error(logMessage);
            this.sentryClient.instance().captureMessage(logMessage);
            if (keepAliveInterval) {
                clearInterval(keepAliveInterval);
            }
            if (pingTimeout) {
                clearTimeout(pingTimeout);
            }
            onDisconnect(err);
        });
        provider._websocket.on('pong', () => {
            if (pingTimeout) {
                clearTimeout(pingTimeout);
            }
        });
    }
    getEnsName(address) {
        return this.provider.lookupAddress(address);
    }
};
EthersService = EthersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, nestjs_sentry_1.InjectSentry)()),
    __metadata("design:paramtypes", [config_1.ConfigService,
        event_emitter_1.EventEmitter2,
        nestjs_sentry_1.SentryService])
], EthersService);
exports.EthersService = EthersService;
//# sourceMappingURL=ethers.service.js.map