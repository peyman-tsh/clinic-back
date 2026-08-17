import { IsOptional, IsString, Length, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePermissionRequest {
  @ApiProperty({
    description: 'Permission name',
    example: 'user.create',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @Length(2, 100)
  name!: string;

  @ApiProperty({
    description: 'Module name this permission belongs to',
    example: 'users',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @Length(2, 100)
  module!: string;

  @ApiPropertyOptional({
    description: 'Permission description',
    example: 'Allows creating new users',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
