import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import {
  EmailAlreadyInUseError,
  EmployeeCodeAlreadyInUseError,
  InvalidUserError,
  UsernameAlreadyInUseError,
  UserNotFoundError,
} from '../../domain/errors/user.errors';

type ManagedUserError =
  | EmailAlreadyInUseError
  | UsernameAlreadyInUseError
  | EmployeeCodeAlreadyInUseError
  | InvalidUserError
  | UserNotFoundError;

@Catch(
  EmailAlreadyInUseError,
  UsernameAlreadyInUseError,
  EmployeeCodeAlreadyInUseError,
  InvalidUserError,
  UserNotFoundError,
)
export class UsersExceptionFilter implements ExceptionFilter {
  catch(exception: ManagedUserError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const status = this.getStatus(exception);

    response.status(status).json({
      statusCode: status,
      code: exception.name,
      message: exception.message,
    });
  }

  private getStatus(exception: ManagedUserError): HttpStatus {
    if (
      exception instanceof EmailAlreadyInUseError ||
      exception instanceof UsernameAlreadyInUseError ||
      exception instanceof EmployeeCodeAlreadyInUseError
    ) {
      return HttpStatus.CONFLICT;
    }

    if (exception instanceof UserNotFoundError) {
      return HttpStatus.NOT_FOUND;
    }

    return HttpStatus.BAD_REQUEST;
  }
}
