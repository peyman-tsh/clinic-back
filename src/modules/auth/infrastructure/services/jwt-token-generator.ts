import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { SignOptions } from 'jsonwebtoken';
import type { TokenGenerator } from '../../application/ports/token-generator';
import { TokenExpiredError } from '../../domain/errors/auth.errors';

@Injectable()
export class JwtTokenGenerator implements TokenGenerator {
  constructor(private readonly jwtService: JwtService) {}

  async signAccessToken(payload: {
    sub: string;
    email: string;
    roles: string[];
  }): Promise<string> {
    const options: SignOptions = {
      subject: payload.sub,
      expiresIn: (process.env.JWT_EXPIRES_IN ?? '1h') as SignOptions['expiresIn'],
    };
    return this.jwtService.signAsync(
      { email: payload.email, roles: payload.roles },
      options,
    );
  }

  async signRefreshToken(payload: { sub: string; jti: string }): Promise<string> {
    const options: SignOptions = {
      subject: payload.sub,
      jwtid: payload.jti,
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ?? '7d') as SignOptions['expiresIn'],
    };
    return this.jwtService.signAsync({}, options);
  }

  async verifyAccessToken(token: string): Promise<{
    sub: string;
    email: string;
    roles: string[];
  }> {
    try {
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        email: string;
        roles: string[];
      }>(token);
      return payload;
    } catch (error) {
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        throw new TokenExpiredError('Access token has expired');
      }
      throw new UnauthorizedException('Invalid access token');
    }
  }

  async verifyRefreshToken(token: string): Promise<{ sub: string; jti: string }> {
    try {
      const payload = await this.jwtService.verifyAsync<{ sub: string; jti: string }>(token);
      return payload;
    } catch (error) {
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        throw new TokenExpiredError('Refresh token has expired');
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}