import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug'],
    bufferLogs: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const logger = app.get(Logger);
  app.useLogger(app.get(Logger));
  await app.listen(3000);
  logger.log('Server is running on http://localhost:3000');
}
bootstrap();
