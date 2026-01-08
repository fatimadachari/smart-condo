import * as dotenv from 'dotenv';
dotenv.config(); // <--- O SEGREDO: Carrega o .env antes de tudo!

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();