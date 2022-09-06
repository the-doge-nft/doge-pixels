"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.NomicsService = void 0;
var common_1 = require("@nestjs/common");
var NomicsService = /** @class */ (function () {
    function NomicsService(config, httpService) {
        this.config = config;
        this.httpService = httpService;
    }
    NomicsService.prototype.getDOGPrice = function () {
        return this.httpService
            .get('https://api.nomics.com/v1/currencies/ticker', {
            params: {
                ids: 'DOG4',
                key: this.config.get('nomicsKey')
            },
            timeout: 10000
        })
            .toPromise();
    };
    NomicsService = __decorate([
        (0, common_1.Injectable)()
    ], NomicsService);
    return NomicsService;
}());
exports.NomicsService = NomicsService;
