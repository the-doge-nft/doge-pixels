"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_1 = require("@nestjs/config");
const configuration_1 = require("./config/configuration");
const schedule_1 = require("@nestjs/schedule");
const pixels_service_1 = require("./pixels/pixels.service");
const prisma_service_1 = require("./prisma.service");
const ethers_service_1 = require("./ethers/ethers.service");
const event_emitter_1 = require("@nestjs/event-emitter");
const axios_1 = require("@nestjs/axios");
const pixels_repository_1 = require("./pixels/pixels.repository");
const nestjs_sentry_1 = require("@ntegral/nestjs-sentry");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                load: [() => configuration_1.default],
            }),
            schedule_1.ScheduleModule.forRoot(),
            event_emitter_1.EventEmitterModule.forRoot(),
            axios_1.HttpModule.register({
                timeout: 5000,
            }),
            nestjs_sentry_1.SentryModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (config) => ({
                    dsn: config.get('sentryDns'),
                    debug: true,
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            prisma_service_1.PrismaService,
            ethers_service_1.EthersService,
            pixels_service_1.PixelsService,
            pixels_repository_1.PixelsRepository,
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map