import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { ScheduleModule } from '@nestjs/schedule';
import { PixelsService } from './pixels/pixels.service';
import { PixelsController } from './pixels/pixels.controller';
import { PrismaService } from './prisma.service';
import { EthersService } from './ethers/ethers.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController, PixelsController],
  providers: [AppService, PrismaService, EthersService, PixelsService],
})
export class AppModule {}
