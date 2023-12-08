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
import * as process from 'process';

@Catch(Error)
export class AllErrorsFilter implements ExceptionFilter {
  private logger = new Logger(AllErrorsFilter.name);

  private wrapInEnvelope(
    message: string,
    exception?: HttpException,
    statusCode = 500,
    error = 'Internal Server Error',
  ) {
    return {
      message,
      error,
      statusCode,
      exception,
    };
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    this.logger.debug(`Client preferred language is ${request['language']}`);

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json(exception.getResponse());

      return;
    }

    if (
      [
        'EACCES',
        'EEXIST',
        'ENOENT',
        'ENOTDIR',
        'ENOTEMPTY',
        'EMFILE',
        'EISDIR',
      ].includes(exception?.code)
    ) {
      if (process.env.NODE_ENV === 'development') {
        return response
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json(this.wrapInEnvelope('File i/o error (check logs)', exception));
      }

      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(this.wrapInEnvelope('File i/o error (check logs)'));
    }

    if (exception instanceof SqliteError) {
      this.logger.error(exception);

      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(this.wrapInEnvelope('DB query error'));
    }

    response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(this.wrapInEnvelope('Unknown error'));
  }
}
