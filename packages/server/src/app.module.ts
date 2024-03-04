import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AlchemyService } from './alchemy/alchemy.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AwsService } from './aws/aws.service';
import { CacheService } from './cache/cache.service';
import { ChainanalysisService } from './chainanalysis/chainanalysis.service';
import { CoinGeckoService } from './coin-gecko/coin-gecko.service';
import configuration from './config/configuration';
import { CurrencyDripService } from './currency-drip/currency-drip.service';
import { CurrencyService } from './currency/currency.service';
import { EthersService } from './ethers/ethers.service';
import { FreeMoneyService } from './free-money/free-money.service';
import { IndexController } from './index/index.controller';
import { MydogeService } from './mydoge/mydoge.service';
import { OwnTheDogeContractService } from './ownthedoge-contracts/ownthedoge-contracts.service';
import { PixelTransferRepository } from './pixel-transfer/pixel-transfer.repository';
import { PixelTransferService } from './pixel-transfer/pixel-transfer.service';
import { PrismaService } from './prisma.service';
import { TwitterService } from './twitter/twitter.service';
import { UnstoppableDomainsService } from './unstoppable-domains/unstoppable-domains.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'public'),
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    HttpModule.register({
      timeout: 5000,
    }),
    // SentryModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (config: ConfigService<Configuration>) => ({
    //     dsn: config.get('sentryDns'),
    //     debug: true,
    //     logLevels: ['verbose'],
    //   }),
    //   inject: [ConfigService],
    // }),
    CacheModule.register({
      ttl: 60 * 60 * 10,
      max: 100000,
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [
    AppController,
    IndexController,
    // DonationController,
    // PhController,
  ],
  providers: [
    PrismaService,
    EthersService,
    OwnTheDogeContractService,
    PixelTransferRepository,
    TwitterService,
    // ImageGeneratorService,
    AwsService,
    CoinGeckoService,
    PixelTransferService,
    UnstoppableDomainsService,
    CacheService,
    MydogeService,
    ChainanalysisService,
    AppService,
    AlchemyService,
    FreeMoneyService,
    CurrencyDripService,
    CurrencyService,
    // DiscordService,
    // StatueCampaignService,
    // RainbowSwapsRepository,
    // RainbowSwapsService,
    // DonationsService,
    // SochainService,
    // BlockcypherService,
    // PhService,
    // DonationHookRequestService,
  ],
})
export class AppModule {}
