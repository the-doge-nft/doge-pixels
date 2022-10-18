import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import * as bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['verbose'],
  });

  app.setBaseViewsDir(join(__dirname, 'views'));
  app.setViewEngine('hbs');

  // currently we are saving images to S3 via JSON bodies posted
  // TODO: integrate multer
  app.use(bodyParser.json({ limit: '10mb' }));

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  await app.listen(app.get(ConfigService).get('PORT'));
}
bootstrap();
