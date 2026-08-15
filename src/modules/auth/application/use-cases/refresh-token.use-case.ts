import { Inject, Injectable } from '@nestjs/common';
import { InvalidRefreshTokenError } from '../../domain/errors/auth.errors';
import { REFRESH_TOKEN_REPOSITORY } from '../../domain/repositories/refresh-token.repository';
import type { RefreshTokenRepository } from '../../domain/repositories/refresh-token.repository';
import { TOKEN_GENERATOR } from '../ports/token-generator';
import type { TokenGenerator } from '../ports/token-generator';
import { AccessToken } from '../../domain/entities/access-token';
import { AuthTokensOutput, RefreshTokenInput } from '../dto/auth.dto';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokens: RefreshTokenRepository,
    @Inject(TOKEN_GENERATOR) private readonly tokens: TokenGenerator,
  ) {}

  async execute(input: RefreshTokenInput): Promise<AuthTokensOutput> {
    const stored = await this.refreshTokens.findByRefreshToken(input.refreshToken);

    if (!stored) {
      throw new InvalidRefreshTokenError();
    }

    stored.verifyRefreshToken();

    const payload = await this.tokens.verifyRefreshToken(input.refreshToken);

    const accessTokenValue = await this.tokens.signAccessToken({
      sub: payload.sub,
      email: '',
      roles: [],
    });

    const refreshTokenValue = await this.tokens.signRefreshToken({
      sub: payload.sub,
      jti: crypto.randomUUID(),
    });

    const token = AccessToken.issue({
      token: accessTokenValue,
      refreshToken: refreshTokenValue,
      accessTokenExpiresInSeconds: Number(process.env.JWT_EXPIRES_IN ?? 3600),
      refreshTokenExpiresInSeconds: Number(process.env.JWT_REFRESH_EXPIRES_IN ?? 604800),
    });

    await this.refreshTokens.delete(input.refreshToken);
    await this.refreshTokens.save(token);

    const properties = token.toProperties();

    return {
      accessToken: properties.token,
      refreshToken: properties.refreshToken,
      accessTokenExpiresAt: properties.accessTokenExpiresAt,
      refreshTokenExpiresAt: properties.refreshTokenExpiresAt,
    };
  }
}