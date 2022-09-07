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

@Injectable()
export class DiscordService implements OnModuleInit {
  private readonly logger = new Logger(DiscordService.name);
  private client: Client;

  constructor(
    private readonly config: ConfigService<Configuration>,
    private readonly imageGenerator: PixelImageGeneratorService,
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

  @OnEvent(Events.PIXEL_MINT_OR_BURN)
  async discordBot({ from, to, tokenId }: PixelMintOrBurnPayload) {
    this.logger.log(`Posting to discord:: (${tokenId}) ${from} -> ${to}`);
    const textContent = await this.imageGenerator.getTextContent(
      from,
      to,
      tokenId,
    );
    const image = await this.imageGenerator.generateMintOrBurnPixelImage(
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

  async DEBUG_TEST() {
    if (this.config.get('isDev')) {
      return this.discordBot({
        from: '0x0000000000000000000000000000000000000000',
        to: '0xd801d86C10e2185a8FCBccFB7D7baF0A6C5B6BD5',
        tokenId: 1191008,
      });
    } else {
      this.logger.log(
        `${arguments.callee.name} only available in development mode`,
      );
    }
  }
}
