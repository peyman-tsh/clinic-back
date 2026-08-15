import { ApiProperty } from '@nestjs/swagger';
import { ClinicOutput } from '../../../application/dto/clinic.dto';
import { ClinicStatus } from '../../../domain/entities/clinic';

export class ClinicResponse {
  @ApiProperty({ description: 'Unique identifier of the clinic', example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ description: 'Name of the clinic', example: 'Sunrise Dental Clinic' })
  name!: string;

  @ApiProperty({ description: 'Unique URL-friendly slug', example: 'sunrise-dental-clinic' })
  slug!: string;

  @ApiProperty({ description: 'Clinic description', example: 'Comprehensive family dental care', nullable: true })
  description!: string | null;

  @ApiProperty({ description: 'Logo image URL', example: 'https://example.com/logo.png', nullable: true })
  logoUrl!: string | null;

  @ApiProperty({ description: 'Main email address', example: 'info@sunrisedental.com', nullable: true })
  email!: string | null;

  @ApiProperty({ description: 'Main phone number', example: '+1234567890', nullable: true })
  phone!: string | null;

  @ApiProperty({ description: 'Clinic website URL', example: 'https://sunrisedental.com', nullable: true })
  website!: string | null;

  @ApiProperty({ description: 'Clinic timezone', example: 'UTC' })
  timezone!: string;

  @ApiProperty({ description: 'Default currency', example: 'USD' })
  currency!: string;

  @ApiProperty({ description: 'Clinic status', enum: ClinicStatus, example: 'active' })
  status!: ClinicStatus;

  @ApiProperty({ description: 'Creation timestamp', example: '2026-01-01T00:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ description: 'Last update timestamp', example: '2026-01-01T00:00:00.000Z' })
  updatedAt!: string;

  static from(output: ClinicOutput): ClinicResponse {
    return {
      id: output.id,
      name: output.name,
      slug: output.slug,
      description: output.description,
      logoUrl: output.logoUrl,
      email: output.email,
      phone: output.phone,
      website: output.website,
      timezone: output.timezone,
      currency: output.currency,
      status: output.status,
      createdAt: output.createdAt.toISOString(),
      updatedAt: output.updatedAt.toISOString(),
    };
  }
}
