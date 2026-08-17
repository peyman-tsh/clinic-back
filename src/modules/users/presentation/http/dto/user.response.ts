import { UserOutput } from '../../../application/dto/user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id!: string;

  @ApiProperty({ description: 'Username of the user', example: 'johndoe' })
  username!: string;

  @ApiProperty({
    description: 'Employee code of the user',
    example: 'EMP-00123',
  })
  employeeCode!: string;

  @ApiProperty({ description: 'First name of the user', example: 'John' })
  firstName!: string;

  @ApiProperty({ description: 'Last name of the user', example: 'Doe' })
  lastName!: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
    nullable: true,
  })
  email!: string | null;

  @ApiProperty({
    description: 'Phone number',
    example: '+989123456789',
    nullable: true,
  })
  phone!: string | null;

  @ApiProperty({
    description: 'Avatar URL',
    example: 'https://example.com/avatar.jpg',
    nullable: true,
  })
  avatar!: string | null;

  @ApiProperty({ description: 'User status', example: 'active' })
  status!: string;

  @ApiProperty({
    description: 'Department UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
    nullable: true,
  })
  departmentId!: string | null;

  @ApiProperty({
    description: 'Manager UUID',
    example: '550e8400-e29b-41d4-a716-446655440001',
    nullable: true,
  })
  managerId!: string | null;

  @ApiProperty({ description: 'Timezone', example: 'Asia/Tehran' })
  timezone!: string;

  @ApiProperty({ description: 'Language code', example: 'fa' })
  language!: string;

  @ApiProperty({
    description: 'Last login timestamp',
    example: '2025-01-01T12:00:00.000Z',
    nullable: true,
  })
  lastLoginAt!: string | null;

  @ApiProperty({
    description: 'Password changed timestamp',
    example: '2025-01-01T12:00:00.000Z',
    nullable: true,
  })
  passwordChangedAt!: string | null;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2025-01-01T12:00:00.000Z',
  })
  createdAt!: string;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2025-01-01T12:00:00.000Z',
  })
  updatedAt!: string;

  static from(output: UserOutput): UserResponse {
    return {
      id: output.id,
      username: output.username,
      employeeCode: output.employeeCode,
      firstName: output.firstName,
      lastName: output.lastName,
      email: output.email,
      phone: output.phone,
      avatar: output.avatar,
      status: output.status,
      departmentId: output.departmentId,
      managerId: output.managerId,
      timezone: output.timezone,
      language: output.language,
      lastLoginAt: output.lastLoginAt ? output.lastLoginAt.toISOString() : null,
      passwordChangedAt: output.passwordChangedAt
        ? output.passwordChangedAt.toISOString()
        : null,
      createdAt: output.createdAt.toISOString(),
      updatedAt: output.updatedAt.toISOString(),
    };
  }
}
