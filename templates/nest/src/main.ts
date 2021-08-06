import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { appConfig } from './configs/configs.constants';
import { CommonLogger } from './common/logger/common-logger';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';

async function bootstrap() {
  const logger = new CommonLogger('Main');
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('Back-end Template')
    .setDescription('The Back-end Template API description')
    .setVersion('1.0')
    .addTag('template')
    .addBearerAuth({ type: 'apiKey', name: 'Authorization', in: 'header' })
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  // Use custom exception filter.
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptionFilter(httpAdapter));

  // Use class serializer.
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new TransformInterceptor());

  // Use global validation pipe.
  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS for AWS.
  app.enableCors();

  const port = appConfig.port;
  logger.log(`App is listening on port ${port}`);
  await app.listen(port);
}
bootstrap();
