import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { ScheduleModule } from '@nestjs/schedule';
import { PixelsService } from './pixels/pixels.service';
import { PrismaService } from './prisma.service';
import { EthersService } from './ethers/ethers.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HttpModule } from '@nestjs/axios';
import { PixelTransfersService } from './pixel-transfers/pixel-transfers.service';

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
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, EthersService, PixelsService, PixelTransfersService],
})
export class AppModule {}
