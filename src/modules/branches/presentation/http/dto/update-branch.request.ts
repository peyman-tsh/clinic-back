import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNumber, IsOptional, IsString, Length, Max, Min } from 'class-validator';
import { BranchStatus } from '../../../domain/entities/branch';

export class UpdateBranchRequest {
  @ApiProperty({ description: 'Branch name', example: 'Frankfurt Central Branch', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 150)
  name?: string;

  @ApiProperty({ description: 'Internal branch code', example: 'FRA-01', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  code?: string;

  @ApiProperty({ description: 'Branch contact email', example: 'frankfurt@glowclinic.de', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Branch contact phone number', example: '+496912345678', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 30)
  phone?: string;

  @ApiProperty({ description: 'Main street address', example: 'Kaiserstraße 12', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  addressLine1?: string;

  @ApiProperty({ description: 'Additional address line', example: 'Building B, Floor 3', required: false })
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiProperty({ description: 'City name', example: 'Frankfurt', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  city?: string;

  @ApiProperty({ description: 'State or Province', example: 'Hessen', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ description: 'Postal code', example: '60311', required: false })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiProperty({ description: 'ISO 2-letter country code', example: 'DE', required: false })
  @IsOptional()
  @IsString()
  @Length(2, 2)
  countryCode?: string;

  @ApiProperty({ description: 'Geographic latitude', example: 50.1109, required: false })
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ApiProperty({ description: 'Geographic longitude', example: 8.6821, required: false })
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @ApiProperty({ description: 'Timezone override (optional)', example: 'Europe/Berlin', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  timezone?: string;

  @ApiProperty({ description: 'Branch status', enum: BranchStatus, required: false })
  @IsOptional()
  @IsEnum(BranchStatus)
  status?: BranchStatus;
}
