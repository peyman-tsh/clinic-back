import { ApiProperty } from '@nestjs/swagger';

class AuthTokensResponse {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIs...',
  })
  accessToken!: string;

  @ApiProperty({
    description: 'JWT refresh token',
    example: 'eyJhbGciOiJIUzI1NiIs...',
  })
  refreshToken!: string;

  @ApiProperty({
    description: 'Access token expiration timestamp',
    example: '2025-01-01T13:00:00.000Z',
  })
  accessTokenExpiresAt!: string;

  @ApiProperty({
    description: 'Refresh token expiration timestamp',
    example: '2025-01-07T12:00:00.000Z',
  })
  refreshTokenExpiresAt!: string;
}

class UserInfoResponse {
  @ApiProperty({
    description: 'User ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id!: string;

  @ApiProperty({ description: 'Email address', example: 'ada@example.com' })
  email!: string;

  @ApiProperty({
    description: 'User roles',
    example: ['admin'],
    type: [String],
  })
  roles!: string[];
}

export class LoginResponse {
  @ApiProperty({
    description: 'Authentication tokens',
    type: AuthTokensResponse,
  })
  accessToken!: AuthTokensResponse;

  @ApiProperty({ description: 'User information', type: UserInfoResponse })
  user!: UserInfoResponse;
}
