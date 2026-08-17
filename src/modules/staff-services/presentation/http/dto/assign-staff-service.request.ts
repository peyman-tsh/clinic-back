import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';

export class AssignStaffServiceRequest {
  @ApiProperty({
    description: 'UUID of the staff member',
    example: 'd9b2d63d-a233-4123-8478-f7efdf7b0b1a',
  })
  @IsUUID()
  staffId!: string;

  @ApiProperty({
    description: 'UUID of the service',
    example: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
  })
  @IsUUID()
  serviceId!: string;

  @ApiPropertyOptional({
    description: 'Custom price override for this staff member in EUR/USD',
    example: 200.0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  priceOverride?: number | null;

  @ApiPropertyOptional({
    description: 'Custom duration override in minutes for this staff member',
    example: 45,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  durationOverrideMinutes?: number | null;

  @ApiPropertyOptional({
    description: 'Custom deposit override for this staff member in EUR/USD',
    example: 50.0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  depositOverride?: number | null;

  @ApiPropertyOptional({
    description:
      'Whether this staff member is currently active for this service',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
