import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  CategoryDoesNotBelongToClinicError,
  InvalidServiceError,
  ServiceNotFoundError,
  ServiceSlugAlreadyInUseError,
} from '../../domain/errors/service.errors';
import { ClinicNotFoundError } from '../../../clinics/domain/errors/clinic.errors';
import { ServiceCategoryNotFoundError } from '../../../service-categories/domain/errors/service-category.errors';

@Catch(
  ServiceNotFoundError,
  ClinicNotFoundError,
  ServiceCategoryNotFoundError,
  CategoryDoesNotBelongToClinicError,
  ServiceSlugAlreadyInUseError,
  InvalidServiceError,
)
export class ServicesExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    if (
      exception instanceof ServiceNotFoundError ||
      exception instanceof ClinicNotFoundError ||
      exception instanceof ServiceCategoryNotFoundError
    ) {
      status = HttpStatus.NOT_FOUND;
    } else if (exception instanceof ServiceSlugAlreadyInUseError) {
      status = HttpStatus.CONFLICT;
    } else if (
      exception instanceof InvalidServiceError ||
      exception instanceof CategoryDoesNotBelongToClinicError
    ) {
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
