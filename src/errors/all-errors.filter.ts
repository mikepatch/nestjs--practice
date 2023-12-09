import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { SqliteError } from 'better-sqlite3';
import { ConfigService } from '@nestjs/config';

@Catch(Error)
export class AllErrorsFilter implements ExceptionFilter {
  private logger = new Logger(AllErrorsFilter.name);

  constructor(private readonly configService: ConfigService<NodeJS.AppEnv>) {}

  private wrapInEnvelope(
    message: string,
    exception: any,
    statusCode = 500,
    error = 'Internal Server Error',
  ) {
    const isDevEnv =
      this.configService.get<NodeJS.AppEnv['NODE_ENV']>('NODE_ENV') ===
      'development';

    return {
      message,
      error,
      statusCode,
      ...{
        exception: isDevEnv ? exception : undefined,
      },
    };
  }

  private isFileSystemError(exception: any): boolean {
    return [
      'EACCES',
      'EEXIST',
      'ENOENT',
      'ENOTDIR',
      'ENOTEMPTY',
      'EMFILE',
      'EISDIR',
    ].includes(exception?.code);
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    this.logger.debug(`Client preferred language is ${request['language']}`);

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json(exception.getResponse());

      this.logger.debug(`(${exception.getStatus()}): ${exception.message}`);
      this.logger.error(exception.getResponse());
      return;
    }

    if (this.isFileSystemError(exception)) {
      this.logger.error(exception.message);

      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(this.wrapInEnvelope('File i/o error (check logs)', exception));
    }

    if (exception instanceof SqliteError) {
      this.logger.error(exception.message);

      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(this.wrapInEnvelope('DB query error', exception));
    }

    response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(this.wrapInEnvelope('Unknown error', exception));

    this.logger.error(`Unknown error: ${exception.message}`);
  }
}
