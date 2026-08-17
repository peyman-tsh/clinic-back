import { ApiProperty } from '@nestjs/swagger';
import { ServiceCategoryOutput } from '../../../application/dto/service-category.dto';

export class ServiceCategoryResponse {
  @ApiProperty({
    description: 'Category UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id!: string;

  @ApiProperty({
    description: 'Parent clinic UUID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  clinicId!: string;

  @ApiProperty({ description: 'Category name', example: 'Injectables' })
  name!: string;

  @ApiProperty({ description: 'URL slug', example: 'injectables' })
  slug!: string;

  @ApiProperty({
    description: 'Category description',
    example: 'Botox and fillers',
    nullable: true,
  })
  description!: string | null;

  @ApiProperty({
    description: 'Category image URL',
    example: 'https://cdn.clinic.com/injectables.jpg',
    nullable: true,
  })
  imageUrl!: string | null;

  @ApiProperty({ description: 'Display order', example: 0 })
  sortOrder!: number;

  @ApiProperty({ description: 'Whether category is available', example: true })
  isActive!: boolean;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2026-01-01T00:00:00.000Z',
  })
  createdAt!: string;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2026-01-01T00:00:00.000Z',
  })
  updatedAt!: string;

  static from(output: ServiceCategoryOutput): ServiceCategoryResponse {
    return {
      id: output.id,
      clinicId: output.clinicId,
      name: output.name,
      slug: output.slug,
      description: output.description,
      imageUrl: output.imageUrl,
      sortOrder: output.sortOrder,
      isActive: output.isActive,
      createdAt: output.createdAt.toISOString(),
      updatedAt: output.updatedAt.toISOString(),
    };
  }
}
