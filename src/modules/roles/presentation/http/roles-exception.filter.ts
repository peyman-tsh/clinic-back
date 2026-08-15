import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import {
  InvalidPermissionError,
  InvalidRoleError,
  PermissionAlreadyInUseError,
  PermissionNotFoundError,
  RoleNameAlreadyInUseError,
  RoleNotFoundError,
  RoleUserNotFoundError,
} from '../../domain/errors/role.errors';

type RolesDomainError =
  | InvalidPermissionError
  | InvalidRoleError
  | PermissionAlreadyInUseError
  | PermissionNotFoundError
  | RoleNameAlreadyInUseError
  | RoleNotFoundError
  | RoleUserNotFoundError;

@Catch(
  InvalidPermissionError,
  InvalidRoleError,
  PermissionAlreadyInUseError,
  PermissionNotFoundError,
  RoleNameAlreadyInUseError,
  RoleNotFoundError,
  RoleUserNotFoundError,
)
export class RolesExceptionFilter implements ExceptionFilter {
  catch(exception: RolesDomainError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const status = this.getStatus(exception);

    response.status(status).json({
      statusCode: status,
      code: exception.name,
      message: exception.message,
    });
  }

  private getStatus(exception: RolesDomainError): HttpStatus {
    if (
      exception instanceof RoleNameAlreadyInUseError ||
      exception instanceof PermissionAlreadyInUseError
    ) {
      return HttpStatus.CONFLICT;
    }

    if (
      exception instanceof RoleNotFoundError ||
      exception instanceof PermissionNotFoundError ||
      exception instanceof RoleUserNotFoundError
    ) {
      return HttpStatus.NOT_FOUND;
    }

    return HttpStatus.BAD_REQUEST;
  }
}
