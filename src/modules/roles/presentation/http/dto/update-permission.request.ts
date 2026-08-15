import { IsOptional, IsString, Length, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePermissionRequest {
  @ApiPropertyOptional({ description: 'Permission name', example: 'user.create', minLength: 2, maxLength: 100 })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  name?: string;

  @ApiPropertyOptional({ description: 'Module name this permission belongs to', example: 'users', minLength: 2, maxLength: 100 })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  module?: string;

  @ApiPropertyOptional({ description: 'Permission description', example: 'Allows creating new users', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string | null;
}