import { RoleOutput } from '../../../application/dto/role.dto';
import { ApiProperty } from '@nestjs/swagger';

export class RoleResponse {
  @ApiProperty({ description: 'Unique identifier of the role', example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ description: 'Role name', example: 'admin' })
  name!: string;

  @ApiProperty({ description: 'Role description', example: 'Administrator with full access', nullable: true })
  description!: string | null;

  @ApiProperty({ description: 'Creation timestamp', example: '2025-01-01T12:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ description: 'Last update timestamp', example: '2025-01-01T12:00:00.000Z' })
  updatedAt!: string;

  static from(output: RoleOutput): RoleResponse {
    return {
      id: output.id,
      name: output.name,
      description: output.description,
      createdAt: output.createdAt.toISOString(),
      updatedAt: output.updatedAt.toISOString(),
    };
  }
}