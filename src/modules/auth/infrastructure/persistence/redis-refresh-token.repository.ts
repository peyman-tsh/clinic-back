import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { AccessToken } from '../../domain/entities/access-token';
import type { RefreshTokenRepository } from '../../domain/repositories/refresh-token.repository';
import { REDIS_CLIENT } from '../../../../shared/redis/redis.module';

@Injectable()
export class RedisRefreshTokenRepository implements RefreshTokenRepository {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  private getKey(refreshToken: string): string {
    return `refresh_token:${refreshToken}`;
  }

  async save(accessToken: AccessToken): Promise<void> {
    const key = this.getKey(accessToken.refreshToken);
    const properties = accessToken.toProperties();

    const data = JSON.stringify({
      token: properties.token,
      refreshToken: properties.refreshToken,
      accessTokenExpiresAt: properties.accessTokenExpiresAt.toISOString(),
      refreshTokenExpiresAt: properties.refreshTokenExpiresAt.toISOString(),
    });

    const now = Date.now();
    const expiresAt = properties.refreshTokenExpiresAt.getTime();
    const ttlSeconds = Math.max(1, Math.floor((expiresAt - now) / 1000));

    await this.redis.set(key, data, 'EX', ttlSeconds);
  }

  async findByRefreshToken(refreshToken: string): Promise<AccessToken | null> {
    const key = this.getKey(refreshToken);
    const rawData = await this.redis.get(key);

    if (!rawData) {
      return null;
    }

    try {
      const parsed = JSON.parse(rawData);
      return AccessToken.rehydrate({
        token: parsed.token,
        refreshToken: parsed.refreshToken,
        accessTokenExpiresAt: new Date(parsed.accessTokenExpiresAt),
        refreshTokenExpiresAt: new Date(parsed.refreshTokenExpiresAt),
      });
    } catch {
      return null;
    }
  }

  async delete(refreshToken: string): Promise<void> {
    const key = this.getKey(refreshToken);
    await this.redis.del(key);
  }
}
