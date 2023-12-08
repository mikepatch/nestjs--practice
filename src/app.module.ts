import { MiddlewareConsumer, Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';

import { AllErrorsFilter } from './errors/all-errors.filter';
import { CookieCheckMiddleware } from './middlewares/cookie-check.middleware';
import { LanguageExtractorMiddleware } from './middlewares/language-extractor.middleware';
import { ProductModule } from './product/product.module';
import { OrdersModule } from './orders/orders.module';
import { SharedModule } from './shared/shared.module';
import { DatabaseModule } from './database/database.module';
import { validationSchema } from './config.schema';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<NodeJS.AppEnv>) => ({
        pinoHttp: {
          level: configService.get('LOG_LEVEL'),
          useLevel: 'debug',
          transport: {
            target: path.resolve(__dirname, 'pino-pretty-config.js'),
          },
          quietReqLogger: true,
        },
      }),
    }),
    ProductModule,
    OrdersModule,
    SharedModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      validationOptions: {
        abortEarly: true,
      },
    }),
  ],
  providers: [{ provide: APP_FILTER, useClass: AllErrorsFilter }],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LanguageExtractorMiddleware, CookieCheckMiddleware)
      .forRoutes('*');
  }
}
