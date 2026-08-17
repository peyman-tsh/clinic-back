import { ApiProperty } from '@nestjs/swagger';
import { BranchOutput } from '../../../application/dto/branch.dto';
import { BranchStatus } from '../../../domain/entities/branch';

export class BranchResponse {
  @ApiProperty({
    description: 'Unique identifier of the branch',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id!: string;

  @ApiProperty({
    description: 'Parent clinic UUID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  clinicId!: string;

  @ApiProperty({
    description: 'Name of the branch',
    example: 'Frankfurt Central Branch',
  })
  name!: string;

  @ApiProperty({
    description: 'Internal branch code',
    example: 'FRA-01',
    nullable: true,
  })
  code!: string | null;

  @ApiProperty({
    description: 'Branch email',
    example: 'frankfurt@glowclinic.de',
    nullable: true,
  })
  email!: string | null;

  @ApiProperty({
    description: 'Branch phone number',
    example: '+496912345678',
    nullable: true,
  })
  phone!: string | null;

  @ApiProperty({
    description: 'Main street address',
    example: 'Kaiserstraße 12',
  })
  addressLine1!: string;

  @ApiProperty({
    description: 'Additional address line',
    example: 'Building B, Floor 3',
    nullable: true,
  })
  addressLine2!: string | null;

  @ApiProperty({ description: 'City name', example: 'Frankfurt' })
  city!: string;

  @ApiProperty({
    description: 'State or province',
    example: 'Hessen',
    nullable: true,
  })
  state!: string | null;

  @ApiProperty({ description: 'Postal code', example: '60311', nullable: true })
  postalCode!: string | null;

  @ApiProperty({ description: 'ISO 2-letter country code', example: 'DE' })
  countryCode!: string;

  @ApiProperty({
    description: 'Geographic latitude',
    example: 50.1109,
    nullable: true,
  })
  latitude!: number | null;

  @ApiProperty({
    description: 'Geographic longitude',
    example: 8.6821,
    nullable: true,
  })
  longitude!: number | null;

  @ApiProperty({
    description: 'Timezone override',
    example: 'Europe/Berlin',
    nullable: true,
  })
  timezone!: string | null;

  @ApiProperty({
    description: 'Branch status',
    enum: BranchStatus,
    example: 'active',
  })
  status!: BranchStatus;

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

  static from(output: BranchOutput): BranchResponse {
    return {
      id: output.id,
      clinicId: output.clinicId,
      name: output.name,
      code: output.code,
      email: output.email,
      phone: output.phone,
      addressLine1: output.addressLine1,
      addressLine2: output.addressLine2,
      city: output.city,
      state: output.state,
      postalCode: output.postalCode,
      countryCode: output.countryCode,
      latitude: output.latitude,
      longitude: output.longitude,
      timezone: output.timezone,
      status: output.status,
      createdAt: output.createdAt.toISOString(),
      updatedAt: output.updatedAt.toISOString(),
    };
  }
}
