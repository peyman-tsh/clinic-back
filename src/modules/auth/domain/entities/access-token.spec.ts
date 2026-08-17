import { AccessToken } from './access-token';

describe('AccessToken', () => {
  it('creates a token pair with correct expiry dates', () => {
    const now = Date.now();
    jest.spyOn(Date, 'now').mockReturnValue(now);

    const token = AccessToken.issue({
      token: 'access-token',
      refreshToken: 'refresh-token',
      accessTokenExpiresInSeconds: 3600,
      refreshTokenExpiresInSeconds: 604800,
    });

    expect(token.token).toBe('access-token');
    expect(token.refreshToken).toBe('refresh-token');
    expect(token.accessTokenExpiresAt.getTime()).toBeGreaterThanOrEqual(
      now + 3600 * 1000,
    );
    expect(token.refreshTokenExpiresAt.getTime()).toBeGreaterThanOrEqual(
      now + 604800 * 1000,
    );
    expect(token.isAccessTokenExpired()).toBe(false);
    expect(token.isRefreshTokenExpired()).toBe(false);

    jest.restoreAllMocks();
  });

  it('detects expired tokens', () => {
    const now = Date.now();
    jest.spyOn(Date, 'now').mockReturnValue(now);

    const token = AccessToken.issue({
      token: 'access-token',
      refreshToken: 'refresh-token',
      accessTokenExpiresInSeconds: 1,
      refreshTokenExpiresInSeconds: -1,
    });

    expect(token.isAccessTokenExpired()).toBe(false);

    jest.spyOn(Date, 'now').mockReturnValue(now + 2000);
    expect(token.isAccessTokenExpired()).toBe(true);
    expect(token.isRefreshTokenExpired()).toBe(true);

    jest.restoreAllMocks();
  });

  it('rehydrates and verifies a refresh token', () => {
    const token = AccessToken.rehydrate({
      token: 'access-token',
      refreshToken: 'refresh-token',
      accessTokenExpiresAt: new Date(Date.now() + 3600 * 1000),
      refreshTokenExpiresAt: new Date(Date.now() + 604800 * 1000),
    });

    expect(() => token.verifyRefreshToken()).not.toThrow();

    const expired = AccessToken.rehydrate({
      token: 'access-token',
      refreshToken: 'refresh-token',
      accessTokenExpiresAt: new Date(Date.now() + 3600 * 1000),
      refreshTokenExpiresAt: new Date(Date.now() - 1000),
    });

    expect(() => expired.verifyRefreshToken()).toThrow();
  });
});
