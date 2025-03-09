import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { registerInstrumentations } from '@opentelemetry/instrumentation';

async function bootstrap() {
  // OpenTelemetry
  const provider = new NodeTracerProvider();
  provider.register();

  registerInstrumentations({
    instrumentations: [new NestInstrumentation()],
  });

  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(cookieParser());
  app.use(bodyParser.json({ limit: 10 }));
  app.use(bodyParser.urlencoded({ limit: 10, extended: true }));

  const config = new DocumentBuilder()
    .setTitle('Crypto Assets API')
    .setDescription('')
    .setVersion('1.0')
    .addBearerAuth()
    .addCookieAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
