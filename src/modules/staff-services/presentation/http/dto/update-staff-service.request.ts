import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateStaffServiceRequest {
  @ApiPropertyOptional({
    description: 'Custom price override for this staff member in EUR/USD',
    example: 250.0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  priceOverride?: number | null;

  @ApiPropertyOptional({
    description: 'Custom duration override in minutes for this staff member',
    example: 60,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  durationOverrideMinutes?: number | null;

  @ApiPropertyOptional({
    description: 'Custom deposit override for this staff member in EUR/USD',
    example: 70.0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  depositOverride?: number | null;

  @ApiPropertyOptional({
    description:
      'Whether this staff member is currently active for this service',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
