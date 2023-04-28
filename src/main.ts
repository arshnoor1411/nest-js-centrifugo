import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { applicationConfig } from 'config';
import helmet from 'helmet';
import * as morgan from 'morgan';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Log the API requests that comes this server way
  app.use(morgan('combined'));

  // Add necessary headers to tighten the security
  app.use(helmet());

  // Allow Cors form only allowed origins
  app.enableCors({
    origin: ['http://localhost:3009', applicationConfig.app.feDomain()],
  });

  // Build a swagger document out of the API's
  const config = new DocumentBuilder()
    .setTitle('Chat Server REST Apis')
    .setDescription('These are apis utilized by chat server')
    .setVersion('1.0')
    .addTag('chatServerApis')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // Its a REST server so makes sense to append it globaly
  app.setGlobalPrefix('api');

  // Handle controller level validations
  app.useGlobalPipes(new ValidationPipe());

  // Let's start the server & listen
  const res = await app.listen(applicationConfig.app.port, '0.0.0.0');
  const serverAddress = res.address();

  console.log(
    `⚡ Server is listening at http://${serverAddress.address}:${serverAddress.port}`,
  );
  console.log(
    `⚡ Checkout Documentation at http://${serverAddress.address}:${serverAddress.port}/api-docs`,
  );
}
bootstrap();
