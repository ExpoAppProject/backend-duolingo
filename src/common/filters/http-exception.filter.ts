import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const rawResponse = exception instanceof HttpException ? exception.getResponse() : null;

    let message = 'Unexpected error';
    let errors: string[] = [];

    if (typeof rawResponse === 'string') {
      message = rawResponse;
    } else if (rawResponse && typeof rawResponse === 'object') {
      const responseObject = rawResponse as { message?: string | string[] };
      if (Array.isArray(responseObject.message)) {
        errors = responseObject.message;
        message = 'Validation failed';
      } else if (typeof responseObject.message === 'string') {
        message = responseObject.message;
      }
    }

    response.status(status).json({
      success: false,
      message,
      errors,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
