import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  InvalidStaffError,
  StaffBranchAlreadyAssignedError,
  StaffNotFoundError,
  UserAlreadyHasStaffProfileError,
} from '../../domain/errors/staff.errors';
import { UserNotFoundError } from '../../../users/domain/errors/user.errors';
import { ClinicNotFoundError } from '../../../clinics/domain/errors/clinic.errors';
import { BranchNotFoundError } from '../../../branches/domain/errors/branch.errors';

@Catch(
  StaffNotFoundError,
  UserNotFoundError,
  ClinicNotFoundError,
  BranchNotFoundError,
  UserAlreadyHasStaffProfileError,
  StaffBranchAlreadyAssignedError,
  InvalidStaffError,
)
export class StaffExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    if (
      exception instanceof StaffNotFoundError ||
      exception instanceof UserNotFoundError ||
      exception instanceof ClinicNotFoundError ||
      exception instanceof BranchNotFoundError
    ) {
      status = HttpStatus.NOT_FOUND;
    } else if (
      exception instanceof UserAlreadyHasStaffProfileError ||
      exception instanceof StaffBranchAlreadyAssignedError
    ) {
      status = HttpStatus.CONFLICT;
    } else if (exception instanceof InvalidStaffError) {
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
