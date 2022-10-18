import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../config/configuration';
import { EthersService } from '../ethers/ethers.service';
import { OnEvent } from '@nestjs/event-emitter';
import { Events, PixelTransferEventPayload } from '../events';
import { ImageGeneratorService } from '../image-generator/image-generator.service';
import { InjectSentry, SentryService } from '@travelerdev/nestjs-sentry';

import * as Twitter from 'twitter';
import { AwsService } from '../aws/aws.service';
import * as crypto from 'crypto';

@Injectable()
export class TwitterService implements OnModuleInit {
  private readonly logger = new Logger(TwitterService.name);
  private client: any;

  constructor(
    private config: ConfigService<Configuration>,
    private imageGenerator: ImageGeneratorService,
    private ethers: EthersService,
    private aws: AwsService,
    @InjectSentry() private readonly sentryClient: SentryService,
  ) {}

  async onModuleInit() {
    this.client = new Twitter({
      consumer_key: this.config.get('twitter').consumerKey,
      consumer_secret: this.config.get('twitter').consumerSecret,
      access_token_key: this.config.get('twitter').accessToken,
      access_token_secret: this.config.get('twitter').secret,
    });
  }

  @OnEvent(Events.PIXEL_TRANSFER)
  async tweetPixelEventImage({
    from,
    to,
    tokenId,
  }: Omit<
    PixelTransferEventPayload,
    'event' | 'blockCreatedAt' | 'blockNumber'
  >) {
    this.logger.log(`Posting to twitter:: (${tokenId}) ${from} -> ${to}`);
    const textContent = await this.imageGenerator.getTextContent(
      from,
      to,
      tokenId,
    );

    const image = await this.imageGenerator.generatePostImage(
      from === this.ethers.zeroAddress ? 'mint' : 'burn',
      tokenId,
    );

    let base64Image = await image.getBase64Async('image/png');
    base64Image = base64Image.replace('data:image/png;base64,', '');

    const mediaId = await this.uploadImageToTwitter(base64Image);
    await this.tweet(mediaId, textContent);
  }

  private uploadImageToTwitter(mediaData): Promise<string> {
    return new Promise((resolve, _) => {
      this.client.post(
        'media/upload',
        { media_data: mediaData },
        (err, data, _) => {
          if (!err) {
            return resolve(data.media_id_string);
          } else {
            this.logger.error(JSON.stringify(err));
            this.sentryClient.instance().captureException(err);
          }
        },
      );
    });
  }

  private tweet(media_id: string, status: string) {
    return this.client.post(
      'statuses/update',
      {
        status,
        media_ids: media_id,
      },
      (err) => {
        if (err) {
          this.logger.error(
            `Error occurred tweeting status: ${JSON.stringify(err)}`,
          );
        }
      },
    );
  }

  public async uploadImageToS3(data: string) {
    const uuid = crypto.randomUUID();
    const filename = `${uuid}.png`;
    const _data = new Buffer(data, 'base64');
    const res = await this.aws.uploadToS3(filename, _data, 'image/png');
    console.log('debug:: res', res);
    return { uuid };
  }

  public DEBUG_TEST() {
    if (this.config.get('isDev')) {
      return this.tweetPixelEventImage({
        from: '0x0000000000000000000000000000000000000000',
        to: '0xd801d86C10e2185a8FCBccFB7D7baF0A6C5B6BD5',
        tokenId: 1191000,
      });
    } else {
      this.logger.log(`DEBUG TEST only available in development mode`);
    }
  }
}
