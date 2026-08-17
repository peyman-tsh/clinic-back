import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import type { SignOptions } from 'jsonwebtoken';
import { UsersModule } from '../users/users.module';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.use-case';
import { SignupUseCase } from './application/use-cases/signup.use-case';
import { TOKEN_GENERATOR } from './application/ports/token-generator';
import { REFRESH_TOKEN_REPOSITORY } from './domain/repositories/refresh-token.repository';
import { JwtTokenGenerator } from './infrastructure/services/jwt-token-generator';
import { RedisRefreshTokenRepository } from './infrastructure/persistence/redis-refresh-token.repository';
import { AuthController } from './presentation/http/auth.controller';
import { JwtAuthGuard } from './presentation/http/guards/jwt-auth.guard';
import { RolesGuard } from './presentation/http/guards/roles.guard';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: (config.get<string>('JWT_EXPIRES_IN') ??
            '1h') as SignOptions['expiresIn'],
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    RefreshTokenUseCase,
    SignupUseCase,
    JwtAuthGuard,
    RolesGuard,
    { provide: TOKEN_GENERATOR, useClass: JwtTokenGenerator },
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: RedisRefreshTokenRepository,
    },
  ],
  exports: [JwtAuthGuard, RolesGuard, TOKEN_GENERATOR],
})
export class AuthModule {}
