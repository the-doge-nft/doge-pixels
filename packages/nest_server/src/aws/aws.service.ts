import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    GuildChannel,
    TextChannel,
} from 'discord.js';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../config/configuration';
import { OnEvent } from '@nestjs/event-emitter';
import { Events, PixelMintOrBurnPayload } from '../events';
import { PixelImageGeneratorService } from '../pixel-image-generator/pixel-image-generator.service';
import { EthersService } from '../ethers/ethers.service';
import { InjectSentry, SentryService } from '@travelerdev/nestjs-sentry';
import {S3} from "aws-sdk";

@Injectable()
export class AwsService implements OnModuleInit {
    private readonly logger = new Logger(AwsService.name);
    private readonly s3Client: S3


    constructor(
        private readonly config: ConfigService<Configuration>,
        @InjectSentry() private readonly sentryClient: SentryService,
    ) {
        this.s3Client = new S3({
            accessKeyId: this.config.get('aws').accessKey,
            secretAccessKey: this.config.get('aws').accessKeySecret
        })
    }

    onModuleInit() {}

    async uploadToS3(fileName: string, body: any) {
        const params = {
            Bucket: this.config.get('aws').bucketName,
            Key: fileName,
            Body: body,
            CreateBucketConfiguration: {
                LocationConstraint: this.config.get('aws').region
            }
        }
        return new Promise((resolve, reject) => {
            this.s3Client.upload(params, (err, data) => {
                if (err) {
                    return reject(err)
                } else {
                    return resolve(data)
                }
            })
        })
    }

}
