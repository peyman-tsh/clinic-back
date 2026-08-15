import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  ClinicNotFoundError,
  ClinicSlugAlreadyInUseError,
  InvalidClinicError,
} from '../../domain/errors/clinic.errors';

@Catch(ClinicNotFoundError, ClinicSlugAlreadyInUseError, InvalidClinicError)
export class ClinicsExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof ClinicNotFoundError) {
      status = HttpStatus.NOT_FOUND;
    } else if (exception instanceof ClinicSlugAlreadyInUseError) {
      status = HttpStatus.CONFLICT;
    } else if (exception instanceof InvalidClinicError) {
      status = HttpStatus.BAD_REQUEST;
    }

    response.status(status).json({
      statusCode: status,
      error: exception.name,
      message: exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}
