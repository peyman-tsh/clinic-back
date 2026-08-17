import { Inject, Injectable } from '@nestjs/common';
import { CreateUserUseCase } from '../../../users/application/use-cases/create-user.use-case';
import { TOKEN_GENERATOR } from '../ports/token-generator';
import type { TokenGenerator } from '../ports/token-generator';
import { REFRESH_TOKEN_REPOSITORY } from '../../domain/repositories/refresh-token.repository';
import type { RefreshTokenRepository } from '../../domain/repositories/refresh-token.repository';
import { AccessToken } from '../../domain/entities/access-token';
import { LoginOutput, SignupInput } from '../dto/auth.dto';

@Injectable()
export class SignupUseCase {
  constructor(
    private readonly createUser: CreateUserUseCase,
    @Inject(TOKEN_GENERATOR) private readonly tokens: TokenGenerator,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokens: RefreshTokenRepository,
  ) {}

  async execute(input: SignupInput): Promise<LoginOutput> {
    const user = await this.createUser.execute({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      password: input.password,
      phone: input.phone,
      avatar: input.avatar,
      timezone: input.timezone,
      language: input.language,
    });

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
