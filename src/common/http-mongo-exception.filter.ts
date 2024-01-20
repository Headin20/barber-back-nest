import { Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { MongoError } from 'mongodb';
import { Error } from 'mongoose';

const errorMappings: Record<string, { status: HttpStatus; message: string }> = {
  ObjectId: { status: HttpStatus.BAD_REQUEST, message: 'Invalid ObjectId' },
  Date: { status: HttpStatus.BAD_REQUEST, message: 'Invalid date format' },
  Number: { status: HttpStatus.BAD_REQUEST, message: 'Invalid number format' },
  Boolean: {
    status: HttpStatus.BAD_REQUEST,
    message: 'Invalid boolean format',
  },
  Undefined: { status: HttpStatus.BAD_REQUEST, message: 'Value is undefined' },
};

const DEFAULT_ERROR = {
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  message: 'Internal server error',
};

@Catch(MongoError, Error.CastError)
export class HttpMongoExceptionFilter extends BaseExceptionFilter {
  catch(exception: MongoError | Error.CastError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if (exception instanceof Error.CastError) {
      const kind = exception.kind as string;
      const errorMapping = errorMappings[kind] || DEFAULT_ERROR;

      response.status(errorMapping.status).json({
        statusCode: errorMapping.status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: errorMapping.message,
      });
    } else {
      const errorMapping = errorMappings[exception.code] || DEFAULT_ERROR;

      response.status(errorMapping.status).json({
        statusCode: errorMapping.status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: errorMapping.message,
      });
    }
  }
}
