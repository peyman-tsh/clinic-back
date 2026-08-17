import {
  InvalidRefreshTokenError,
  TokenExpiredError,
} from '../errors/auth.errors';

export interface AccessTokenProperties {
  token: string;
  refreshToken: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date;
}

export class AccessToken {
  constructor(private properties: AccessTokenProperties) {}

  static issue(input: {
    token: string;
    refreshToken: string;
    accessTokenExpiresInSeconds: number;
    refreshTokenExpiresInSeconds: number;
  }): AccessToken {
    const now = new Date();
    return new AccessToken({
      token: input.token,
      refreshToken: input.refreshToken,
      accessTokenExpiresAt: new Date(
        now.getTime() + input.accessTokenExpiresInSeconds * 1000,
      ),
      refreshTokenExpiresAt: new Date(
        now.getTime() + input.refreshTokenExpiresInSeconds * 1000,
      ),
    });
  }

  static rehydrate(properties: AccessTokenProperties): AccessToken {
    return new AccessToken({ ...properties });
  }

  get token(): string {
    return this.properties.token;
  }

  get refreshToken(): string {
    return this.properties.refreshToken;
  }

  get accessTokenExpiresAt(): Date {
    return this.properties.accessTokenExpiresAt;
  }

  get refreshTokenExpiresAt(): Date {
    return this.properties.refreshTokenExpiresAt;
  }

  isAccessTokenExpired(): boolean {
    return this.properties.accessTokenExpiresAt.getTime() <= Date.now();
  }

  isRefreshTokenExpired(): boolean {
    return this.properties.refreshTokenExpiresAt.getTime() <= Date.now();
  }

  verifyRefreshToken(): void {
    if (!this.properties.refreshToken) {
      throw new InvalidRefreshTokenError();
    }
    if (this.isRefreshTokenExpired()) {
      throw new TokenExpiredError('Refresh token has expired');
    }
  }

  toProperties(): AccessTokenProperties {
    return { ...this.properties };
  }
}
