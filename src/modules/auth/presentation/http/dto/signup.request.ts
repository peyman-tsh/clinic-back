import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignupRequest {
  @ApiProperty({ description: 'First name of the user', example: 'Ada' })
  @IsString()
  @Length(1, 100)
  firstName!: string;

  @ApiProperty({ description: 'Last name of the user', example: 'Lovelace' })
  @IsString()
  @Length(1, 100)
  lastName!: string;

  @ApiProperty({ description: 'Email address', example: 'ada@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Password with at least 8 characters, 1 uppercase, 1 number',
    example: 'SecurePass123',
    minLength: 8,
    maxLength: 72,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'Password must contain lowercase, uppercase, and a number',
  })
  password!: string;

  @ApiPropertyOptional({ description: 'Phone number', example: '+12025550123' })
  @IsOptional()
  @IsString()
  @Length(3, 32)
  phone?: string;

  @ApiPropertyOptional({ description: 'Avatar URL', example: 'https://example.com/avatar.png' })
  @IsOptional()
  @IsUrl()
  avatar?: string;

  @ApiPropertyOptional({ description: 'Timezone (IANA)', example: 'Asia/Tehran', default: 'UTC' })
  @IsOptional()
  @IsString()
  @Length(1, 64)
  timezone?: string;

  @ApiPropertyOptional({ description: 'Language code', example: 'fa', default: 'en' })
  @IsOptional()
  @IsString()
  @Length(2, 10)
  language?: string;
}