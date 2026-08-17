import { Injectable } from '@nestjs/common';
import { AccessToken } from '../../domain/entities/access-token';
import type { RefreshTokenRepository } from '../../domain/repositories/refresh-token.repository';

@Injectable()
export class InMemoryRefreshTokenRepository implements RefreshTokenRepository {
  private readonly store = new Map<string, AccessToken>();

  async save(accessToken: AccessToken): Promise<void> {
    this.store.set(accessToken.refreshToken, accessToken);
  }

  async findByRefreshToken(refreshToken: string): Promise<AccessToken | null> {
    return this.store.get(refreshToken) ?? null;
  }

  async delete(refreshToken: string): Promise<void> {
    this.store.delete(refreshToken);
  }
}
