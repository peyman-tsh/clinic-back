import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Min,
} from 'class-validator';

export class CreateServiceCategoryRequest {
  @ApiProperty({
    description: 'Parent clinic UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  clinicId!: string;

  @ApiProperty({ description: 'Category name', example: 'Injectables' })
  @IsString()
  @Length(1, 150)
  name!: string;

  @ApiProperty({
    description: 'URL slug (optional, auto-generated if omitted)',
    example: 'injectables',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 150)
  slug?: string;

  @ApiProperty({
    description: 'Category description',
    example: 'Botox, fillers, and anti-aging treatments',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Category image URL',
    example: 'https://cdn.clinic.com/images/injectables.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  imageUrl?: string;

  @ApiProperty({
    description: 'Display order',
    example: 0,
    required: false,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiProperty({
    description: 'Whether category is available',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
