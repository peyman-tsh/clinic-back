import { ApiProperty } from '@nestjs/swagger';
import { ServiceOutput } from '../../../application/dto/service.dto';

export class ServiceResponse {
  @ApiProperty({ description: 'Service UUID', example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ description: 'Parent clinic UUID', example: '550e8400-e29b-41d4-a716-446655440001' })
  clinicId!: string;

  @ApiProperty({ description: 'Parent category UUID', example: '550e8400-e29b-41d4-a716-446655440002' })
  categoryId!: string;

  @ApiProperty({ description: 'Service name', example: 'Botox Treatment' })
  name!: string;

  @ApiProperty({ description: 'URL slug', example: 'botox-treatment' })
  slug!: string;

  @ApiProperty({ description: 'Service description', example: 'Facial wrinkle reduction treatment', nullable: true })
  description!: string | null;

  @ApiProperty({ description: 'Service image URL', example: 'https://cdn.clinic.com/images/botox.jpg', nullable: true })
  imageUrl!: string | null;

  @ApiProperty({ description: 'Treatment duration in minutes', example: 30 })
  durationMinutes!: number;

  @ApiProperty({ description: 'Buffer time before treatment in minutes', example: 5 })
  bufferBeforeMinutes!: number;

  @ApiProperty({ description: 'Buffer time after treatment in minutes', example: 10 })
  bufferAfterMinutes!: number;

  @ApiProperty({ description: 'Total occupied calendar time in minutes (bufferBefore + duration + bufferAfter)', example: 45 })
  totalOccupiedMinutes!: number;

  @ApiProperty({ description: 'Service price', example: 180.00 })
  price!: number;

  @ApiProperty({ description: 'Required deposit amount', example: 50.00, nullable: true })
  depositAmount!: number | null;

  @ApiProperty({ description: 'Whether service is active', example: true })
  isActive!: boolean;

  @ApiProperty({ description: 'Display order', example: 0 })
  sortOrder!: number;

  @ApiProperty({ description: 'Creation timestamp', example: '2026-01-01T00:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ description: 'Last update timestamp', example: '2026-01-01T00:00:00.000Z' })
  updatedAt!: string;

  static from(output: ServiceOutput): ServiceResponse {
    return {
      id: output.id,
      clinicId: output.clinicId,
      categoryId: output.categoryId,
      name: output.name,
      slug: output.slug,
      description: output.description,
      imageUrl: output.imageUrl,
      durationMinutes: output.durationMinutes,
      bufferBeforeMinutes: output.bufferBeforeMinutes,
      bufferAfterMinutes: output.bufferAfterMinutes,
      totalOccupiedMinutes: output.totalOccupiedMinutes,
      price: output.price,
      depositAmount: output.depositAmount,
      isActive: output.isActive,
      sortOrder: output.sortOrder,
      createdAt: output.createdAt.toISOString(),
      updatedAt: output.updatedAt.toISOString(),
    };
  }
}
