import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  InvalidServiceCategoryError,
  ServiceCategoryNotFoundError,
  ServiceCategorySlugAlreadyInUseError,
} from '../../domain/errors/service-category.errors';
import { ClinicNotFoundError } from '../../../clinics/domain/errors/clinic.errors';

@Catch(
  ServiceCategoryNotFoundError,
  ClinicNotFoundError,
  ServiceCategorySlugAlreadyInUseError,
  InvalidServiceCategoryError,
)
export class ServiceCategoriesExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    if (
      exception instanceof ServiceCategoryNotFoundError ||
      exception instanceof ClinicNotFoundError
    ) {
      status = HttpStatus.NOT_FOUND;
    } else if (exception instanceof ServiceCategorySlugAlreadyInUseError) {
      status = HttpStatus.CONFLICT;
    } else if (exception instanceof InvalidServiceCategoryError) {
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
