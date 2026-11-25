import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, VersioningType } from '@nestjs/common';
import { AllExceptionsFilter } from './exception-filters/http-exception.filter';
import { json, urlencoded } from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('Egrampanchayat ')
    .setDescription('The Egrampanchayat API description')
    .setVersion('1.0')

    .addSecurity('ApiTokenAuth', {
      type: 'http',
      in: 'header',
      scheme: 'Bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
    })

    .addSecurityRequirements('ApiTokenAuth')
    .build();
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc-v1', app, document);
  app.enableCors();
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.useGlobalFilters(new AllExceptionsFilter());

  console.log(process.env.PORT);
  const isProduction = false;
  // || process.env.NODE_ENV === 'production';
  console.log('NODE_ENV', process.env.NODE_ENV);
  // Set log levels in production
  if (isProduction) {
    Logger.log('Running in production mode');
    console.log = function () {};
    app.useLogger(['error']); // Only log errors and warnings in production
  } else {
    app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']); // Full logs in non-production
  }
  await app.listen(Number(process.env.PORT));
}
bootstrap();
