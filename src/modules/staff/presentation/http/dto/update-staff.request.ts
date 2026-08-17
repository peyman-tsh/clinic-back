import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Length, Matches } from 'class-validator';
import { StaffStatus } from '../../../domain/entities/staff';

export class UpdateStaffRequest {
  @ApiProperty({
    description: 'Job title',
    example: 'Chief Dermatologist',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  jobTitle?: string;

  @ApiProperty({
    description: 'Public staff biography',
    example: 'Specialist in cosmetic laser procedures',
    required: false,
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({
    description: 'Professional license number',
    example: 'LIC-987654',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  licenseNumber?: string;

  @ApiProperty({
    description: 'Calendar display hex color',
    example: '#3357FF',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'color must be a valid hex color (e.g. #3357FF)',
  })
  color?: string;

  @ApiProperty({
    description: 'Staff status',
    enum: StaffStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(StaffStatus)
  status?: StaffStatus;
}
