import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Inject } from '@nestjs/common';
import { TOKEN_GENERATOR } from '../../../application/ports/token-generator';
import type { TokenGenerator } from '../../../application/ports/token-generator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(TOKEN_GENERATOR) private readonly tokens: TokenGenerator,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization as string | undefined;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid Authorization header',
      );
    }

    const token = authHeader.slice(7);

    try {
      const payload = await this.tokens.verifyAccessToken(token);
      request.user = {
        id: payload.sub,
        email: payload.email,
        roles: payload.roles,
      };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
