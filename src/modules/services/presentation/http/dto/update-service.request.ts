import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Min,
} from 'class-validator';

export class UpdateServiceRequest {
  @ApiProperty({
    description: 'Parent category UUID',
    example: '550e8400-e29b-41d4-a716-446655440001',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiProperty({
    description: 'Service name',
    example: 'Botox Special Treatment',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 150)
  name?: string;

  @ApiProperty({
    description: 'URL slug',
    example: 'botox-special-treatment',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 150)
  slug?: string;

  @ApiProperty({
    description: 'Service description',
    example: 'Facial wrinkle reduction treatment',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Service image URL',
    example: 'https://cdn.clinic.com/images/botox.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  imageUrl?: string;

  @ApiProperty({
    description: 'Service treatment duration in minutes',
    example: 30,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  durationMinutes?: number;

  @ApiProperty({
    description: 'Preparation time in minutes before appointment',
    example: 5,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  bufferBeforeMinutes?: number;

  @ApiProperty({
    description: 'Cleanup/recovery time in minutes after appointment',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  bufferAfterMinutes?: number;

  @ApiProperty({
    description: 'Default service price',
    example: 200.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({
    description: 'Required deposit amount',
    example: 60.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  depositAmount?: number;

  @ApiProperty({
    description: 'Whether service is active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Display order', example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
