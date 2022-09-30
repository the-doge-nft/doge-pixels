import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration, { Configuration } from './config/configuration';
import { ScheduleModule } from '@nestjs/schedule';
import { PixelsService } from './pixels/pixels.service';
import { PrismaService } from './prisma.service';
import { EthersService } from './ethers/ethers.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HttpModule } from '@nestjs/axios';
import { PixelsRepository } from './pixels/pixels.repository';
import { TwitterService } from './twitter/twitter.service';
import { DiscordService } from './discord/discord.service';
import { PixelImageGeneratorService } from './pixel-image-generator/pixel-image-generator.service';
import { SentryModule } from '@travelerdev/nestjs-sentry';
import { AwsService } from './aws/aws.service';
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from 'path'
import { CoinGeckoService } from './coin-gecko/coin-gecko.service';
import * as redisStore from 'cache-manager-redis-store'

@Module({
  imports: [
      ConfigModule.forRoot({
          isGlobal: true,
          load: [() => configuration],
      }),
      ServeStaticModule.forRoot({
        rootPath: join(__dirname, 'public')
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
              max: 1000,
          }),
          inject: [ConfigService]
      }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    EthersService,
    PixelsService,
    PixelsRepository,
    TwitterService,
    DiscordService,
    PixelImageGeneratorService,
    AwsService,
    CoinGeckoService,
  ],
})
export class AppModule {}
