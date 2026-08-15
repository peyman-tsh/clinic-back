import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class AssignBranchRequest {
  @ApiProperty({ description: 'Target branch UUID', example: '550e8400-e29b-41d4-a716-446655440002' })
  @IsUUID()
  branchId!: string;

  @ApiProperty({ description: 'Whether this branch is the staff member primary location', example: true, required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
