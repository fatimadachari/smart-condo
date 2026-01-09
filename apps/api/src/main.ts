import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Ativar validação global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove campos que não estão no DTO (segurança)
    forbidNonWhitelisted: true, // Dá erro se mandar campo que não existe
    transform: true, // Transforma os dados para o tipo do DTO automaticamente
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();