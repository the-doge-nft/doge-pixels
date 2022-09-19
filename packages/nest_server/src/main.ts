import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import * as bodyParser from "body-parser";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setBaseViewsDir(join(__dirname, 'views'));
  app.setViewEngine('hbs');

  app.use(bodyParser.json({limit: '10mb'}))

  app.enableCors();
  await app.listen(app.get(ConfigService).get('PORT'));
}
bootstrap();
