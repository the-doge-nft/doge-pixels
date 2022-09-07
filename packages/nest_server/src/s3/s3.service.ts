import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectSentry, SentryService } from '@travelerdev/nestjs-sentry';
import { PixelImageGeneratorService } from '../pixel-image-generator/pixel-image-generator.service';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../config/configuration';
import { S3 } from 'aws-sdk';

@Injectable()
export class S3Service implements OnModuleInit {
  private readonly logger = new Logger(S3Service.name);

  private client: S3;
  private bucketName: string;

  constructor(
    @InjectSentry() private readonly sentryClient: SentryService,
    private config: ConfigService<Configuration>,
  ) {
    this.bucketName = this.config.get('aws').bucketName;
  }

  async onModuleInit() {
    this.logger.log('share init');
    this.client = new S3({
      accessKeyId: this.config.get('aws').accessKeyId,
      secretAccessKey: this.config.get('aws').accessKeySecret,
    });
  }

  async uploadToBucket() {}
}
