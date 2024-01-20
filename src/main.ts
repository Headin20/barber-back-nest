import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { HttpMongoExceptionFilter } from './common/http-mongo-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });
  app.enableCors();

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Barber')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, document);
  app.useGlobalFilters(new HttpMongoExceptionFilter());

  await app.listen(process.env.PORT);
}
bootstrap();
