import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Clinic, ClinicProperties } from '../../domain/entities/clinic';
import { ClinicSlugAlreadyInUseError } from '../../domain/errors/clinic.errors';
import type { ClinicRepository } from '../../domain/repositories/clinic.repository';
import { ClinicOrmEntity } from './clinic.orm-entity';

@Injectable()
export class TypeOrmClinicRepository implements ClinicRepository {
  constructor(
    @InjectRepository(ClinicOrmEntity)
    private readonly clinics: Repository<ClinicOrmEntity>,
  ) {}

  async save(clinic: Clinic): Promise<void> {
    try {
      await this.clinics.save(this.toEntity(clinic));
    } catch (error: unknown) {
      if (this.isUniqueViolation(error)) {
        throw new ClinicSlugAlreadyInUseError(clinic.slug);
      }
      throw error;
    }
  }

  async findById(id: string): Promise<Clinic | null> {
    const entity = await this.clinics.findOneBy({ id });
    return entity ? this.toDomain(entity) : null;
  }

  async findBySlug(slug: string): Promise<Clinic | null> {
    const entity = await this.clinics
      .createQueryBuilder('clinic')
      .where('LOWER(clinic.slug) = LOWER(:slug)', { slug })
      .getOne();

    return entity ? this.toDomain(entity) : null;
  }

  async findAll(): Promise<Clinic[]> {
    const entities = await this.clinics.find({
      order: { createdAt: 'DESC', id: 'DESC' },
    });

    return entities.map((entity) => this.toDomain(entity));
  }

  async delete(id: string): Promise<void> {
    await this.clinics.softDelete(id);
  }

  private toDomain(entity: ClinicOrmEntity): Clinic {
    const properties: ClinicProperties = {
      id: entity.id,
      name: entity.name,
      slug: entity.slug,
      description: entity.description,
      logoUrl: entity.logoUrl,
      email: entity.email,
      phone: entity.phone,
      website: entity.website,
      timezone: entity.timezone,
      currency: entity.currency,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };

    return Clinic.rehydrate(properties);
  }

  private toEntity(clinic: Clinic): ClinicOrmEntity {
    const props = clinic.toProperties();
    const entity = new ClinicOrmEntity();
    entity.id = props.id;
    entity.name = props.name;
    entity.slug = props.slug;
    entity.description = props.description;
    entity.logoUrl = props.logoUrl;
    entity.email = props.email;
    entity.phone = props.phone;
    entity.website = props.website;
    entity.timezone = props.timezone;
    entity.currency = props.currency;
    entity.status = props.status;
    entity.createdAt = props.createdAt;
    entity.updatedAt = props.updatedAt;
    entity.deletedAt = props.deletedAt;
    return entity;
  }

  private isUniqueViolation(error: unknown): boolean {
    if (typeof error !== 'object' || error === null || !('driverError' in error)) {
      return false;
    }

    const { driverError } = error;
    return (
      typeof driverError === 'object' &&
      driverError !== null &&
      'code' in driverError &&
      driverError.code === '23505'
    );
  }
}
