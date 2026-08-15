import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString, IsUUID, Length, Matches } from 'class-validator';
import { StaffStatus } from '../../../domain/entities/staff';

export class CreateStaffRequest {
  @ApiProperty({ description: 'Associated User account UUID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  userId!: string;

  @ApiProperty({ description: 'Parent Clinic UUID', example: '550e8400-e29b-41d4-a716-446655440001' })
  @IsUUID()
  clinicId!: string;

  @ApiProperty({ description: 'Job title', example: 'Senior Dermatologist', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  jobTitle?: string;

  @ApiProperty({ description: 'Public staff biography', example: 'Specialist in cosmetic laser procedures', required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ description: 'Professional license number', example: 'LIC-987654', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  licenseNumber?: string;

  @ApiProperty({ description: 'Calendar display hex color', example: '#3357FF', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, { message: 'color must be a valid hex color (e.g. #3357FF)' })
  color?: string;

  @ApiProperty({ description: 'Staff status', enum: StaffStatus, required: false, default: StaffStatus.ACTIVE })
  @IsOptional()
  @IsEnum(StaffStatus)
  status?: StaffStatus;
}
