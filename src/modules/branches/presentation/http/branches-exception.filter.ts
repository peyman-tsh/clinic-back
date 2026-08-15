import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  BranchCodeAlreadyInUseError,
  BranchNotFoundError,
  InvalidBranchError,
} from '../../domain/errors/branch.errors';
import { ClinicNotFoundError } from '../../../clinics/domain/errors/clinic.errors';

@Catch(
  BranchNotFoundError,
  ClinicNotFoundError,
  BranchCodeAlreadyInUseError,
  InvalidBranchError,
)
export class BranchesExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    if (
      exception instanceof BranchNotFoundError ||
      exception instanceof ClinicNotFoundError
    ) {
      status = HttpStatus.NOT_FOUND;
    } else if (exception instanceof BranchCodeAlreadyInUseError) {
      status = HttpStatus.CONFLICT;
    } else if (exception instanceof InvalidBranchError) {
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
