import { ApiProperty } from '@nestjs/swagger';
import { StaffBranchOutput, StaffOutput } from '../../../application/dto/staff.dto';
import { StaffStatus } from '../../../domain/entities/staff';

export class StaffBranchResponse {
  @ApiProperty({ description: 'Assignment UUID' })
  id!: string;

  @ApiProperty({ description: 'Branch UUID' })
  branchId!: string;

  @ApiProperty({ description: 'Is primary working branch' })
  isPrimary!: boolean;

  @ApiProperty({ description: 'Assignment timestamp' })
  createdAt!: string;

  static from(output: StaffBranchOutput): StaffBranchResponse {
    return {
      id: output.id,
      branchId: output.branchId,
      isPrimary: output.isPrimary,
      createdAt: output.createdAt.toISOString(),
    };
  }
}

export class StaffResponse {
  @ApiProperty({ description: 'Staff UUID', example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ description: 'Associated User account UUID', example: '550e8400-e29b-41d4-a716-446655440001' })
  userId!: string;

  @ApiProperty({ description: 'Parent Clinic UUID', example: '550e8400-e29b-41d4-a716-446655440002' })
  clinicId!: string;

  @ApiProperty({ description: 'Job title', example: 'Senior Dermatologist', nullable: true })
  jobTitle!: string | null;

  @ApiProperty({ description: 'Public biography', example: 'Specialist in cosmetic laser procedures', nullable: true })
  bio!: string | null;

  @ApiProperty({ description: 'Professional license number', example: 'LIC-987654', nullable: true })
  licenseNumber!: string | null;

  @ApiProperty({ description: 'Calendar display color', example: '#3357FF', nullable: true })
  color!: string | null;

  @ApiProperty({ description: 'Staff status', enum: StaffStatus, example: 'active' })
  status!: StaffStatus;

  @ApiProperty({ description: 'Assigned branches', type: [StaffBranchResponse] })
  branches!: StaffBranchResponse[];

  @ApiProperty({ description: 'Creation timestamp', example: '2026-01-01T00:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ description: 'Last update timestamp', example: '2026-01-01T00:00:00.000Z' })
  updatedAt!: string;

  static from(output: StaffOutput): StaffResponse {
    return {
      id: output.id,
      userId: output.userId,
      clinicId: output.clinicId,
      jobTitle: output.jobTitle,
      bio: output.bio,
      licenseNumber: output.licenseNumber,
      color: output.color,
      status: output.status,
      branches: (output.branches ?? []).map((b) => StaffBranchResponse.from(b)),
      createdAt: output.createdAt.toISOString(),
      updatedAt: output.updatedAt.toISOString(),
    };
  }
}
