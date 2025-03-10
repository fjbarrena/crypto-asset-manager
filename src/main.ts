import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { ValidationPipe } from '@nestjs/common';
import { GenericExceptionFilter } from './filters/generic-exception.filter';

async function bootstrap() {
  // OpenTelemetry
  const provider = new NodeTracerProvider();
  provider.register();

  registerInstrumentations({
    instrumentations: [new NestInstrumentation()],
  });

  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new GenericExceptionFilter());

  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());
  app.use(cookieParser());
  app.use(bodyParser.json({ limit: '100kb' }));
  app.use(bodyParser.urlencoded({ limit: '100kb', extended: true }));

  const config = new DocumentBuilder()
    .setTitle('Crypto Assets API')
    .setDescription('')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
