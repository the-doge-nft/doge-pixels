import { HttpModule } from '@nestjs/axios';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { SentryModule } from '@travelerdev/nestjs-sentry';
import * as redisStore from 'cache-manager-redis-store';
import { join } from 'path';
import { AlchemyService } from './alchemy/alchemy.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AwsService } from './aws/aws.service';
import { BlockcypherService } from './blockcypher/blockcypher.service';
import { CacheService } from './cache/cache.service';
import { ChainanalysisService } from './chainanalysis/chainanalysis.service';
import { CoinGeckoService } from './coin-gecko/coin-gecko.service';
import configuration, { Configuration } from './config/configuration';
import { DiscordService } from './discord/discord.service';
import { DonationsService } from './donations/donations.service';
import { EthersService } from './ethers/ethers.service';
import { ImageGeneratorService } from './image-generator/image-generator.service';
import { IndexController } from './index/index.controller';
import { MydogeService } from './mydoge/mydoge.service';
import { OwnTheDogeContractService } from './ownthedoge-contracts/ownthedoge-contracts.service';
import { PhController } from './ph/ph.controller';
import { PhService } from './ph/ph.service';
import { PixelTransferRepository } from './pixel-transfer/pixel-transfer.repository';
import { PixelTransferService } from './pixel-transfer/pixel-transfer.service';
import { PrismaService } from './prisma.service';
import { RainbowSwapsRepository } from './rainbow-swaps/rainbow-swaps.repository';
import { RainbowSwapsService } from './rainbow-swaps/rainbow-swaps.service';
import { SochainService } from './sochain/sochain.service';
import { DonationController } from './statue-campaign/statue-campaign.controller';
import { StatueCampaignService } from './statue-campaign/statue-campaign.service';
import { TwitterService } from './twitter/twitter.service';
import { UnstoppableDomainsService } from './unstoppable-domains/unstoppable-domains.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => configuration],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'public'),
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    HttpModule.register({
      timeout: 5000,
    }),
    SentryModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService<Configuration>) => ({
        dsn: config.get('sentryDns'),
        debug: true,
        logLevels: ['debug'],
      }),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      useFactory: (config: ConfigService<Configuration>) => ({
        store: redisStore,
        host: config.get('redis').host,
        port: config.get('redis').port,
        auth_pass: config.get('redis').password,
        ttl: 10,
        max: 10000,
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [
    AppController,
    IndexController,
    DonationController,
    PhController,
  ],
  providers: [
    PrismaService,
    EthersService,
    OwnTheDogeContractService,
    PixelTransferRepository,
    TwitterService,
    DiscordService,
    ImageGeneratorService,
    ImageGeneratorService,
    AwsService,
    CoinGeckoService,
    PixelTransferService,
    UnstoppableDomainsService,
    StatueCampaignService,
    AlchemyService,
    RainbowSwapsRepository,
    RainbowSwapsService,
    DonationsService,
    SochainService,
    CacheService,
    MydogeService,
    ChainanalysisService,
    AppService,
    BlockcypherService,
    PhService,
  ],
})
export class AppModule {}
