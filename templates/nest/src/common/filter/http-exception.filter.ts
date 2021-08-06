import {
  Catch,
  ArgumentsHost,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request } from 'express';
import { ILog } from '../logger/log.interface';
import { CommonLogger } from '../logger/common-logger';

@Catch(InternalServerErrorException)
export class HttpExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new CommonLogger('HttpExceptionFilter');

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const thisLog: ILog = {
      endpoint: request.path,
      ipAddress:
        request.headers['x-forwarded-for'] || request.connection.remoteAddress,
      method: request.method,
      error: exception,
    };

    this.logger.customError(exception.message, exception.stack, thisLog);

    super.catch(exception, host);
  }
}
