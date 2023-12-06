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

@Catch(Error)
export class AllErrorsFilter implements ExceptionFilter {
  private logger = new Logger(AllErrorsFilter.name);

  private wrapInEnvelope(
    message: string,
    statusCode = 500,
    error = 'Internal Server Error',
  ) {
    return {
      message,
      error,
      statusCode,
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
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'File i/o error (check logs)',
        error: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    if (exception instanceof SqliteError) {
      this.logger.error(exception);

      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(this.wrapInEnvelope('DB query error'));
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Unknown error',
      error: 'Internal Server Error',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
