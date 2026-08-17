import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import {
  InvalidCredentialsError,
  InvalidRefreshTokenError,
  TokenExpiredError,
} from '../../domain/errors/auth.errors';
import { EmailAlreadyInUseError } from '../../../users/domain/errors/user.errors';

@Catch(
  InvalidCredentialsError,
  InvalidRefreshTokenError,
  TokenExpiredError,
  EmailAlreadyInUseError,
)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    let status = HttpStatus.UNAUTHORIZED;
    let code = 'Unauthorized';

    if (exception instanceof InvalidCredentialsError) {
      status = HttpStatus.UNAUTHORIZED;
      code = 'InvalidCredentialsError';
    } else if (exception instanceof InvalidRefreshTokenError) {
      status = HttpStatus.UNAUTHORIZED;
      code = 'InvalidRefreshTokenError';
    } else if (exception instanceof TokenExpiredError) {
      status = HttpStatus.UNAUTHORIZED;
      code = 'TokenExpiredError';
    } else if (exception instanceof EmailAlreadyInUseError) {
      status = HttpStatus.CONFLICT;
      code = 'EmailAlreadyInUseError';
    }

    response.status(status).json({
      statusCode: status,
      code,
      message: exception instanceof Error ? exception.message : 'Error',
    });
  }
}
