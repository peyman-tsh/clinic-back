import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, Length, Matches } from 'class-validator';
import { ClinicStatus } from '../../../domain/entities/clinic';

export class CreateClinicRequest {
  @ApiProperty({ description: 'Name of the clinic', example: 'Sunrise Dental Clinic' })
  @IsString()
  @Length(1, 150)
  name!: string;

  @ApiProperty({ description: 'Unique URL-friendly slug', example: 'sunrise-dental-clinic', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 150)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'slug must be lowercase letters, numbers, and hyphens' })
  slug?: string;

  @ApiProperty({ description: 'Clinic description', example: 'Comprehensive family dental care', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Logo image URL', example: 'https://example.com/logo.png', required: false })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiProperty({ description: 'Main contact email address', example: 'info@sunrisedental.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Main contact phone number', example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 30)
  phone?: string;

  @ApiProperty({ description: 'Clinic website URL', example: 'https://sunrisedental.com', required: false })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ description: 'Clinic timezone', example: 'America/New_York', required: false, default: 'UTC' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  timezone?: string;

  @ApiProperty({ description: 'Clinic default currency', example: 'USD', required: false, default: 'USD' })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  currency?: string;

  @ApiProperty({ description: 'Clinic status', enum: ClinicStatus, required: false, default: ClinicStatus.Active })
  @IsOptional()
  @IsEnum(ClinicStatus)
  status?: ClinicStatus;
}
