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
import { Events, PixelTransferEventPayload } from '../events';
import { ImageGeneratorService } from '../image-generator/image-generator.service';
import { EthersService } from '../ethers/ethers.service';
import { InjectSentry, SentryService } from '@travelerdev/nestjs-sentry';

@Injectable()
export class DiscordService implements OnModuleInit {
  private readonly logger = new Logger(DiscordService.name);
  private client: Client;

  constructor(
    private readonly config: ConfigService<Configuration>,
    private readonly imageGenerator: ImageGeneratorService,
    private readonly ethers: EthersService,
    @InjectSentry() private readonly sentryClient: SentryService,
  ) {}

  onModuleInit() {
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    });
    this.client.login(this.config.get('discord').secret);
    this.client.once('ready', () => {
      this.logger.log('Auth success');
    });
  }

  @OnEvent(Events.PIXEL_TRANSFER)
  async post({
    from,
    to,
    tokenId,
  }: Omit<
    PixelTransferEventPayload,
    'event' | 'blockCreatedAt' | 'blockNumber'
  >) {
    this.logger.log(`Posting to discord:: (${tokenId}) ${from} -> ${to}`);
    const textContent = await this.imageGenerator.getTextContent(
      from,
      to,
      tokenId,
    );
    const image = await this.imageGenerator.generatePostImage(
      from === this.ethers.zeroAddress ? 'mint' : 'burn',
      tokenId,
    );
    const base64Buffer = await image.getBufferAsync('image/png');

    try {
      const channel = this.client.channels.cache.get(
        this.config.get('discord').channelId,
      ) as TextChannel;
      await channel.send({
        content: textContent,
        files: [
          {
            attachment: base64Buffer,
          },
        ],
      });
    } catch (e) {
      this.logger.error(`error sending image to discord channel: ${e.message}`);
      this.sentryClient.instance().captureException(e);
    }
  }

  async DEBUG_TEST(id: number) {
    if (this.config.get('isDev')) {
      return this.post({
        from: '0x0000000000000000000000000000000000000000',
        to: '0xd801d86C10e2185a8FCBccFB7D7baF0A6C5B6BD5',
        tokenId: id,
      });
    } else {
      this.logger.log(`DEBUG TEST only available in development mode`);
    }
  }
}
