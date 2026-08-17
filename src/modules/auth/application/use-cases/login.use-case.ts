import { Inject, Injectable } from '@nestjs/common';
import { InvalidCredentialsError } from '../../domain/errors/auth.errors';
import { USER_REPOSITORY } from '../../../users/domain/repositories/user.repository';
import type { UserRepository } from '../../../users/domain/repositories/user.repository';
import { USER_PASSWORD_HASHER } from '../../../users/application/ports/password-hasher';
import type { PasswordHasher } from '../../../users/application/ports/password-hasher';
import { TOKEN_GENERATOR } from '../ports/token-generator';
import type { TokenGenerator } from '../ports/token-generator';
import { REFRESH_TOKEN_REPOSITORY } from '../../domain/repositories/refresh-token.repository';
import type { RefreshTokenRepository } from '../../domain/repositories/refresh-token.repository';
import { AccessToken } from '../../domain/entities/access-token';
import { LoginInput, LoginOutput } from '../dto/auth.dto';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(USER_PASSWORD_HASHER) private readonly passwords: PasswordHasher,
    @Inject(TOKEN_GENERATOR) private readonly tokens: TokenGenerator,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokens: RefreshTokenRepository,
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const user = await this.users.findByEmail(input.email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = await this.passwords.verify(
      input.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    const accessTokenValue = await this.tokens.signAccessToken({
      sub: user.id,
      email: user.email!,
      roles: [],
    });

    const refreshTokenValue = await this.tokens.signRefreshToken({
      sub: user.id,
      jti: crypto.randomUUID(),
    });

    const token = AccessToken.issue({
      token: accessTokenValue,
      refreshToken: refreshTokenValue,
      accessTokenExpiresInSeconds: Number(process.env.JWT_EXPIRES_IN ?? 3600),
      refreshTokenExpiresInSeconds: Number(
        process.env.JWT_REFRESH_EXPIRES_IN ?? 604800,
      ),
    });

    await this.refreshTokens.save(token);

    const properties = token.toProperties();

    return {
      accessToken: {
        accessToken: properties.token,
        refreshToken: properties.refreshToken,
        accessTokenExpiresAt: properties.accessTokenExpiresAt,
        refreshTokenExpiresAt: properties.refreshTokenExpiresAt,
      },
      user: {
        id: user.id,
        email: user.email!,
        roles: [],
      },
    };
  }
}
