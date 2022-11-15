import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';

// definimos la ruta
const crPath = '/backend-oic/certs/certificate.crt';
const pkPath = '/backend-oic/certs/keyfile-encrypted.key';
const options: any = {};




async function bootstrap() {
 
  // validamos si los archivos existen
if (fs.existsSync(pkPath) && fs.existsSync(crPath)) {
  // cargamos los archivos sobre las options
  options.httpsOptions = {
    key:fs.readFileSync(pkPath, 'utf8'),
    cert:fs.readFileSync(crPath),
  }
}


  const app = await NestFactory.create(AppModule,options);//,{ httpsOptions }
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  const port = configService.get('PORT', { infer: true });
  app.enableCors();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
  