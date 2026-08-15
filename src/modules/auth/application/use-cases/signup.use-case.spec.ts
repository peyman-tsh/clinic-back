import { SignupUseCase } from './signup.use-case';

describe('SignupUseCase', () => {
  const createUser = {
    execute: jest.fn(),
  };
  const tokens = {
    signAccessToken: jest.fn(),
    signRefreshToken: jest.fn(),
    verifyAccessToken: jest.fn(),
    verifyRefreshToken: jest.fn(),
  };
  const refreshTokens = {
    save: jest.fn(),
    findByRefreshToken: jest.fn(),
    delete: jest.fn(),
  };

  const subject = new SignupUseCase(
    createUser as never,
    tokens as never,
    refreshTokens as never,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_EXPIRES_IN = '3600';
    process.env.JWT_REFRESH_EXPIRES_IN = '604800';
  });

  it('creates a user and issues a token pair', async () => {
    createUser.execute.mockResolvedValue({
      id: 'user_1',
      email: 'ada@example.com',
    });
    tokens.signAccessToken.mockResolvedValue('access-token');
    tokens.signRefreshToken.mockResolvedValue('refresh-token');
    refreshTokens.save.mockResolvedValue(undefined);

    const output = await subject.execute({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      password: 'a-secure-password',
    });

    expect(createUser.execute).toHaveBeenCalledWith({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      password: 'a-secure-password',
      phone: undefined,
      avatar: undefined,
      timezone: undefined,
      language: undefined,
    });
    expect(output.accessToken.accessToken).toBe('access-token');
    expect(output.accessToken.refreshToken).toBe('refresh-token');
    expect(output.user).toEqual({
      id: 'user_1',
      email: 'ada@example.com',
      roles: [],
    });
    expect(refreshTokens.save).toHaveBeenCalledTimes(1);
  });

  it('propagates errors from user creation', async () => {
    createUser.execute.mockRejectedValue(new Error('EmailAlreadyInUseError'));

    await expect(
      subject.execute({
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        password: 'a-secure-password',
      }),
    ).rejects.toThrow('EmailAlreadyInUseError');
    expect(tokens.signAccessToken).not.toHaveBeenCalled();
  });
});