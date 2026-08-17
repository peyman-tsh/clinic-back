import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserStatus } from '../../../domain/entities/user';

export class UpdateUserRequest {
  @ApiPropertyOptional({
    description: 'Username of the user',
    example: 'johndoe',
    minLength: 2,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  username?: string;

  @ApiPropertyOptional({
    description: 'Employee code',
    example: 'EMP-00123',
    minLength: 1,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  employeeCode?: string;

  @ApiPropertyOptional({
    description: 'First name of the user',
    example: 'John',
    minLength: 1,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Last name of the user',
    example: 'Doe',
    minLength: 1,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Password for the account',
    example: 'NewSecurePass456',
    minLength: 8,
    maxLength: 72,
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password?: string;

  @ApiPropertyOptional({
    description: 'Phone number',
    example: '+989123456789',
    minLength: 3,
    maxLength: 32,
  })
  @IsOptional()
  @IsString()
  @Length(3, 32)
  phone?: string | null;

  @ApiPropertyOptional({
    description: 'Avatar URL',
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsUrl()
  avatar?: string | null;

  @ApiPropertyOptional({
    description: 'User status',
    enum: UserStatus,
    example: UserStatus.Active,
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional({
    description: 'Department UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  departmentId?: string | null;

  @ApiPropertyOptional({
    description: 'Manager UUID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsOptional()
  @IsUUID()
  managerId?: string | null;

  @ApiPropertyOptional({
    description: 'Timezone',
    example: 'Asia/Tehran',
    minLength: 1,
    maxLength: 64,
  })
  @IsOptional()
  @IsString()
  @Length(1, 64)
  timezone?: string;

  @ApiPropertyOptional({
    description: 'Language code',
    example: 'fa',
    minLength: 2,
    maxLength: 10,
  })
  @IsOptional()
  @IsString()
  @Length(2, 10)
  language?: string;
}
