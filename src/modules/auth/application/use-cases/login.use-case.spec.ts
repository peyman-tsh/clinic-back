import { InvalidCredentialsError } from '../../domain/errors/auth.errors';
import { AccessToken } from '../../domain/entities/access-token';
import { LoginUseCase } from './login.use-case';
import { User } from '../../../users/domain/entities/user';

describe('LoginUseCase', () => {
  const users = {
    findByEmail: jest.fn(),
  };
  const passwords = {
    hash: jest.fn(),
    verify: jest.fn(),
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

  const subject = new LoginUseCase(
    users as never,
    passwords as never,
    tokens as never,
    refreshTokens as never,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('authenticates a valid user and issues token pair', async () => {
    const user = User.register({
      id: 'user_1',
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      passwordHash: 'hashed:secret',
    });

    users.findByEmail.mockResolvedValue(user);
    passwords.verify.mockResolvedValue(true);
    tokens.signAccessToken.mockResolvedValue('access-token');
    tokens.signRefreshToken.mockResolvedValue('refresh-token');
    refreshTokens.save.mockResolvedValue(undefined);
    process.env.JWT_EXPIRES_IN = '3600';
    process.env.JWT_REFRESH_EXPIRES_IN = '604800';

    const output = await subject.execute({
      email: 'ada@example.com',
      password: 'a-secure-password',
    });

    expect(passwords.verify).toHaveBeenCalledWith(
      'a-secure-password',
      'hashed:secret',
    );
    expect(output.accessToken.accessToken).toBe('access-token');
    expect(output.accessToken.refreshToken).toBe('refresh-token');
    expect(output.user).toEqual({
      id: 'user_1',
      email: 'ada@example.com',
      roles: [],
    });
    expect(refreshTokens.save).toHaveBeenCalledTimes(1);
  });

  it('rejects an unknown email with InvalidCredentialsError', async () => {
    users.findByEmail.mockResolvedValue(null);

    await expect(
      subject.execute({ email: 'missing@example.com', password: 'whatever-pass' }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
    expect(passwords.verify).not.toHaveBeenCalled();
  });

  it('rejects a wrong password with InvalidCredentialsError', async () => {
    const user = User.register({
      id: 'user_1',
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      passwordHash: 'hashed:secret',
    });

    users.findByEmail.mockResolvedValue(user);
    passwords.verify.mockResolvedValue(false);

    await expect(
      subject.execute({ email: 'ada@example.com', password: 'wrong-password' }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
    expect(tokens.signAccessToken).not.toHaveBeenCalled();
  });
});