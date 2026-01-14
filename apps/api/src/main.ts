import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Validation Pipe Global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Filtro de Exceção Global
  app.useGlobalFilters(new HttpExceptionFilter());

  // Interceptors Globais
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Smart Condo API')
    .setDescription('API para gerenciamento de condomínios - Sistema completo para administração condominial')
    .setVersion('1.0')
    .addTag('Condomínios', 'Endpoints para gestão de condomínios')
    .addTag('Usuários', 'Endpoints para gestão de usuários')
    .addTag('Unidades', 'Endpoints para gestão de unidades')
    .addTag('Avisos', 'Endpoints para gestão de avisos')
    .addTag('Áreas Comuns', 'Endpoints para gestão de áreas comuns')
    .addTag('Reservas', 'Endpoints para gestão de reservas')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Insira o token JWT',
        in: 'header',
      },
      'JWT-auth'
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Smart Condo API Docs',
    customfavIcon: 'https://nestjs.com/img/logo_text.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  
  console.log(`Servidor rodando em: http://localhost:${port}`);
  console.log(`Documentação Swagger em: http://localhost:${port}/api/docs`);
}
bootstrap();