import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class UpdateServiceCategoryRequest {
  @ApiProperty({
    description: 'Category name',
    example: 'Facial Injectables',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 150)
  name?: string;

  @ApiProperty({
    description: 'URL slug',
    example: 'facial-injectables',
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

  @ApiProperty({ description: 'Display order', example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiProperty({
    description: 'Whether category is available',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
