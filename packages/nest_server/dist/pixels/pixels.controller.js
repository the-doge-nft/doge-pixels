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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PixelsController = void 0;
const common_1 = require("@nestjs/common");
const pixels_service_1 = require("./pixels.service");
let PixelsController = class PixelsController {
    constructor(pixelsService) {
        this.pixelsService = pixelsService;
    }
    async testPostPixels() {
        return { success: true };
    }
};
__decorate([
    (0, common_1.Get)('test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PixelsController.prototype, "testPostPixels", null);
PixelsController = __decorate([
    (0, common_1.Controller)('pixels'),
    __metadata("design:paramtypes", [pixels_service_1.PixelsService])
], PixelsController);
exports.PixelsController = PixelsController;
//# sourceMappingURL=pixels.controller.js.map