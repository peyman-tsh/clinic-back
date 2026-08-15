import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Branch, BranchProperties } from '../../domain/entities/branch';
import { BranchCodeAlreadyInUseError } from '../../domain/errors/branch.errors';
import type { BranchRepository } from '../../domain/repositories/branch.repository';
import { BranchOrmEntity } from './branch.orm-entity';

@Injectable()
export class TypeOrmBranchRepository implements BranchRepository {
  constructor(
    @InjectRepository(BranchOrmEntity)
    private readonly branches: Repository<BranchOrmEntity>,
  ) {}

  async save(branch: Branch): Promise<void> {
    try {
      await this.branches.save(this.toEntity(branch));
    } catch (error: unknown) {
      if (this.isUniqueViolation(error)) {
        throw new BranchCodeAlreadyInUseError(branch.code ?? '', branch.clinicId);
      }
      throw error;
    }
  }

  async findById(id: string): Promise<Branch | null> {
    const entity = await this.branches.findOneBy({ id });
    return entity ? this.toDomain(entity) : null;
  }

  async findByClinicIdAndCode(clinicId: string, code: string): Promise<Branch | null> {
    const entity = await this.branches
      .createQueryBuilder('branch')
      .where('branch.clinic_id = :clinicId', { clinicId })
      .andWhere('LOWER(branch.code) = LOWER(:code)', { code })
      .getOne();

    return entity ? this.toDomain(entity) : null;
  }

  async findByClinicId(clinicId: string): Promise<Branch[]> {
    const entities = await this.branches.find({
      where: { clinicId },
      order: { createdAt: 'DESC', id: 'DESC' },
    });

    return entities.map((entity) => this.toDomain(entity));
  }

  async findAll(): Promise<Branch[]> {
    const entities = await this.branches.find({
      order: { createdAt: 'DESC', id: 'DESC' },
    });

    return entities.map((entity) => this.toDomain(entity));
  }

  async delete(id: string): Promise<void> {
    await this.branches.softDelete(id);
  }

  private toDomain(entity: BranchOrmEntity): Branch {
    const properties: BranchProperties = {
      id: entity.id,
      clinicId: entity.clinicId,
      name: entity.name,
      code: entity.code,
      email: entity.email,
      phone: entity.phone,
      addressLine1: entity.addressLine1,
      addressLine2: entity.addressLine2,
      city: entity.city,
      state: entity.state,
      postalCode: entity.postalCode,
      countryCode: entity.countryCode,
      latitude: entity.latitude,
      longitude: entity.longitude,
      timezone: entity.timezone,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };

    return Branch.rehydrate(properties);
  }

  private toEntity(branch: Branch): BranchOrmEntity {
    const props = branch.toProperties();
    const entity = new BranchOrmEntity();
    entity.id = props.id;
    entity.clinicId = props.clinicId;
    entity.name = props.name;
    entity.code = props.code;
    entity.email = props.email;
    entity.phone = props.phone;
    entity.addressLine1 = props.addressLine1;
    entity.addressLine2 = props.addressLine2;
    entity.city = props.city;
    entity.state = props.state;
    entity.postalCode = props.postalCode;
    entity.countryCode = props.countryCode;
    entity.latitude = props.latitude;
    entity.longitude = props.longitude;
    entity.timezone = props.timezone;
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
