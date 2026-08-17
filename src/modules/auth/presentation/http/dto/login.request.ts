import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginRequest {
  @ApiProperty({ description: 'Email address', example: 'ada@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Password',
    example: 'a-secure-password',
    minLength: 8,
    maxLength: 72,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password!: string;
}
