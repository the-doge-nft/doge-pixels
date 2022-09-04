import { Module } from '@nestjs/common';
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
// import { SentryModule } from '@ntegral/nestjs-sentry';
import { TwitterService } from './twitter/twitter.service';
import { DiscordService } from './discord/discord.service';
import { PixelImageGeneratorService } from './pixel-image-generator/pixel-image-generator.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [() => configuration],
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
    //   }),
    //   inject: [ConfigService],
    // }),
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
  ],
})
export class AppModule {}
