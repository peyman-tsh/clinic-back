import { ApiProperty } from '@nestjs/swagger';
import { StaffServiceOutput } from '../../../application/dto/staff-service.dto';

export class StaffServiceResponse {
  @ApiProperty({
    description: 'Staff service assignment UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id!: string;

  @ApiProperty({
    description: 'Staff UUID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  staffId!: string;

  @ApiProperty({
    description: 'Service UUID',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  serviceId!: string;

  @ApiProperty({
    description: 'Custom price override in EUR/USD',
    example: 200.0,
    nullable: true,
  })
  priceOverride!: number | null;

  @ApiProperty({
    description: 'Custom duration override in minutes',
    example: 45,
    nullable: true,
  })
  durationOverrideMinutes!: number | null;

  @ApiProperty({
    description: 'Custom deposit override in EUR/USD',
    example: 50.0,
    nullable: true,
  })
  depositOverride!: number | null;

  @ApiProperty({
    description:
      'Whether this staff member is currently active for this service',
    example: true,
  })
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

  static from(output: StaffServiceOutput): StaffServiceResponse {
    return {
      id: output.id,
      staffId: output.staffId,
      serviceId: output.serviceId,
      priceOverride: output.priceOverride,
      durationOverrideMinutes: output.durationOverrideMinutes,
      depositOverride: output.depositOverride,
      isActive: output.isActive,
      createdAt: output.createdAt.toISOString(),
      updatedAt: output.updatedAt.toISOString(),
    };
  }
}
