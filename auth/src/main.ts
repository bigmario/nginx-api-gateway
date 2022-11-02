import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {} from '@nestjs/swagger';

async function bootstrap() {
  BigInt.prototype['toJSON'] = function () {
    return parseInt(this);
  };

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get('LOCAL_PORT');
  const hostname = configService.get('HOST');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Base API')
    .setDescription('Base API')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'oauth2',
      flows: {
        password: {
          authorizationUrl: '',
          scopes: {},
          tokenUrl: `${configService.get('BASE_URL')}/auth/login`,
          refreshUrl: '',
        },
      },
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors();

  await app.listen(process.env.PORT || port, hostname);
}
bootstrap();
