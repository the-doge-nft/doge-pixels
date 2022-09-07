import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectSentry, SentryService } from '@travelerdev/nestjs-sentry';
import { PixelImageGeneratorService } from '../pixel-image-generator/pixel-image-generator.service';

@Injectable()
export class ShareService implements OnModuleInit {
  private readonly logger = new Logger(ShareService.name);

  constructor(
    private imageGenerate: PixelImageGeneratorService,
    @InjectSentry() private readonly sentryClient: SentryService,
  ) {}

  async onModuleInit() {
    this.logger.log('share init');
  }

  generatePixelMintOrBurnShare(pixels: number[], isMinted: boolean) {
    const image = this.imageGenerate.generateShareImage(pixels, isMinted);
  }
}
