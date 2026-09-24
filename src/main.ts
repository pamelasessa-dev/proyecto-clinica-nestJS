
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module.js';
import { PrismaExceptionFilter } from './prisma/prisma-exception.filter.js';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor.js';

async function bootstrap(){
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalFilters(new PrismaExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
  .setTitle('Clínica Salud Integral')
  .setDescription('API de clínica, migrada a NestJS')
  .setVersion ('1.0')
  .addBearerAuth(
    {
    type: 'http',
    scheme: 'bearer',
    name: 'JWT',
    description:'ingresa tu JWT token aqui',
    in: 'header',
    },
    'JWT-auth',

  )
  .build()
  
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  app.useGlobalFilters(new PrismaExceptionFilter());

  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(configService.getOrThrow<number>('PORT'))
}

bootstrap();