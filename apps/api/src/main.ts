import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Habilitar CORS para o Front (faremos ajuste fino na Etapa 5, mas libera geral agora para testar)
  app.enableCors();

  // A Railway injeta a porta na variável PORT. 
  // O '0.0.0.0' é necessário para containers Docker (como a Railway usa).
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
