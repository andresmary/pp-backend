import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('Planning Poker - Andrés Mary - 2023')
    .setDescription('Planing Poker API')
    .setVersion('1.0')
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  app.enableCors();
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(3001);
}
bootstrap();
