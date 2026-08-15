import { PermissionOutput } from '../../../application/dto/permission.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PermissionResponse {
  @ApiProperty({ description: 'Unique identifier of the permission', example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ description: 'Permission name', example: 'user.create' })
  name!: string;

  @ApiProperty({ description: 'Module name this permission belongs to', example: 'users' })
  module!: string;

  @ApiProperty({ description: 'Permission description', example: 'Allows creating new users', nullable: true })
  description!: string | null;

  @ApiProperty({ description: 'Creation timestamp', example: '2025-01-01T12:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ description: 'Last update timestamp', example: '2025-01-01T12:00:00.000Z' })
  updatedAt!: string;

  static from(output: PermissionOutput): PermissionResponse {
    return {
      id: output.id,
      name: output.name,
      module: output.module,
      description: output.description,
      createdAt: output.createdAt.toISOString(),
      updatedAt: output.updatedAt.toISOString(),
    };
  }
}