import {
  InvalidRefreshTokenError,
  TokenExpiredError,
} from '../../domain/errors/auth.errors';
import { AccessToken } from '../../domain/entities/access-token';
import { RefreshTokenUseCase } from './refresh-token.use-case';

describe('RefreshTokenUseCase', () => {
  const refreshTokens = {
    save: jest.fn(),
    findByRefreshToken: jest.fn(),
    delete: jest.fn(),
  };
  const tokens = {
    signAccessToken: jest.fn(),
    signRefreshToken: jest.fn(),
    verifyAccessToken: jest.fn(),
    verifyRefreshToken: jest.fn(),
  };

  const subject = new RefreshTokenUseCase(refreshTokens, tokens);

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_EXPIRES_IN = '3600';
    process.env.JWT_REFRESH_EXPIRES_IN = '604800';
  });

  it('issues a fresh token pair for a valid refresh token', async () => {
    const stored = AccessToken.rehydrate({
      token: 'old-access-token',
      refreshToken: 'valid-refresh-token',
      accessTokenExpiresAt: new Date(Date.now() + 3600 * 1000),
      refreshTokenExpiresAt: new Date(Date.now() + 604800 * 1000),
    });

    refreshTokens.findByRefreshToken.mockResolvedValue(stored);
    tokens.verifyRefreshToken.mockResolvedValue({
      sub: 'user_1',
      jti: 'jti_1',
    });
    tokens.signAccessToken.mockResolvedValue('new-access-token');
    tokens.signRefreshToken.mockResolvedValue('new-refresh-token');
    refreshTokens.delete.mockResolvedValue(undefined);
    refreshTokens.save.mockResolvedValue(undefined);

    const output = await subject.execute({
      refreshToken: 'valid-refresh-token',
    });

    expect(tokens.verifyRefreshToken).toHaveBeenCalledWith(
      'valid-refresh-token',
    );
    expect(tokens.signAccessToken).toHaveBeenCalledWith({
      sub: 'user_1',
      email: '',
      roles: [],
    });
    expect(refreshTokens.delete).toHaveBeenCalledWith('valid-refresh-token');
    expect(refreshTokens.save).toHaveBeenCalledTimes(1);
    expect(output.accessToken).toBe('new-access-token');
    expect(output.refreshToken).toBe('new-refresh-token');
  });

  it('rejects an unknown refresh token', async () => {
    refreshTokens.findByRefreshToken.mockResolvedValue(null);

    await expect(
      subject.execute({ refreshToken: 'unknown-refresh-token' }),
    ).rejects.toBeInstanceOf(InvalidRefreshTokenError);
    expect(tokens.verifyRefreshToken).not.toHaveBeenCalled();
  });

  it('rejects an expired refresh token', async () => {
    const expired = AccessToken.rehydrate({
      token: 'old-access-token',
      refreshToken: 'expired-refresh-token',
      accessTokenExpiresAt: new Date(Date.now() + 3600 * 1000),
      refreshTokenExpiresAt: new Date(Date.now() - 1000),
    });

    refreshTokens.findByRefreshToken.mockResolvedValue(expired);

    await expect(
      subject.execute({ refreshToken: 'expired-refresh-token' }),
    ).rejects.toBeInstanceOf(TokenExpiredError);
  });
});
