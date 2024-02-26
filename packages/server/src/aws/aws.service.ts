import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { Configuration } from '../config/configuration';

@Injectable()
export class AwsService implements OnModuleInit {
  private readonly logger = new Logger(AwsService.name);
  private readonly s3Client: S3;

  constructor(
    private readonly config: ConfigService<Configuration>,
    // @InjectSentry() private readonly sentryClient: SentryService,
  ) {
    this.s3Client = new S3({
      accessKeyId: this.config.get('aws').accessKey,
      secretAccessKey: this.config.get('aws').accessKeySecret,
    });
  }

  onModuleInit() {}

  async uploadToS3(fileName: string, body: any, contentType: string) {
    const params = {
      Bucket: this.config.get('aws').bucketName,
      Key: fileName,
      Body: body,
      CreateBucketConfiguration: {
        LocationConstraint: this.config.get('aws').region,
      },
      ContentType: contentType,
    };
    return new Promise((resolve, reject) => {
      this.s3Client.upload(params, (err, data) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(data);
        }
      });
    });
  }
}
