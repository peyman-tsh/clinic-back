import { AccessToken } from '../entities/access-token';

export const REFRESH_TOKEN_REPOSITORY = Symbol('REFRESH_TOKEN_REPOSITORY');

export interface RefreshTokenRepository {
  save(accessToken: AccessToken): Promise<void>;
  findByRefreshToken(refreshToken: string): Promise<AccessToken | null>;
  delete(refreshToken: string): Promise<void>;
}
