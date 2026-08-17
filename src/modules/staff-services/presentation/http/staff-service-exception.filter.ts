import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  InvalidStaffServiceError,
  StaffServiceAlreadyExistsError,
  StaffServiceClinicMismatchError,
  StaffServiceNotFoundError,
} from '../../domain/errors/staff-service.errors';
import { StaffNotFoundError } from '../../../staff/domain/errors/staff.errors';
import { ServiceNotFoundError } from '../../../services/domain/errors/service.errors';

@Catch(
  StaffServiceNotFoundError,
  StaffServiceAlreadyExistsError,
  StaffServiceClinicMismatchError,
  InvalidStaffServiceError,
  StaffNotFoundError,
  ServiceNotFoundError,
)
export class StaffServiceExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    if (
      exception instanceof StaffServiceNotFoundError ||
      exception instanceof StaffNotFoundError ||
      exception instanceof ServiceNotFoundError
    ) {
      status = HttpStatus.NOT_FOUND;
    } else if (exception instanceof StaffServiceAlreadyExistsError) {
      status = HttpStatus.CONFLICT;
    } else if (
      exception instanceof InvalidStaffServiceError ||
      exception instanceof StaffServiceClinicMismatchError
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
