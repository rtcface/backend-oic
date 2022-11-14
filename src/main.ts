import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const fs = require('fs');

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('../certs/private-key.pem'),
    cert: fs.readFileSync('../certs/public-certificate.pem'),
  };
  const app = await NestFactory.create(AppModule,{ httpsOptions });//
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  const port = configService.get('PORT', { infer: true });
  app.enableCors();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
  