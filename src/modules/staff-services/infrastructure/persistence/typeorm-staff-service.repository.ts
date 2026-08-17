import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { FindOptionsWhere, Repository } from 'typeorm';
import {
  StaffService,
  StaffServiceProperties,
} from '../../domain/entities/staff-service';
import { StaffServiceAlreadyExistsError } from '../../domain/errors/staff-service.errors';
import type {
  FindStaffServicesFilter,
  StaffServiceRepository,
} from '../../domain/repositories/staff-service.repository';
import { StaffServiceOrmEntity } from './staff-service.orm-entity';

@Injectable()
export class TypeOrmStaffServiceRepository implements StaffServiceRepository {
  constructor(
    @InjectRepository(StaffServiceOrmEntity)
    private readonly staffServiceRepo: Repository<StaffServiceOrmEntity>,
  ) {}

  async save(staffService: StaffService): Promise<void> {
    try {
      await this.staffServiceRepo.save(this.toEntity(staffService));
    } catch (error: unknown) {
      if (this.isUniqueViolation(error)) {
        throw new StaffServiceAlreadyExistsError(
          staffService.staffId,
          staffService.serviceId,
        );
      }
      throw error;
    }
  }

  async findById(id: string): Promise<StaffService | null> {
    const entity = await this.staffServiceRepo.findOneBy({ id });
    return entity ? this.toDomain(entity) : null;
  }

  async findByStaffIdAndServiceId(
    staffId: string,
    serviceId: string,
  ): Promise<StaffService | null> {
    const entity = await this.staffServiceRepo.findOneBy({
      staffId,
      serviceId,
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findByStaffId(staffId: string): Promise<StaffService[]> {
    const entities = await this.staffServiceRepo.find({
      where: { staffId },
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findByServiceId(serviceId: string): Promise<StaffService[]> {
    const entities = await this.staffServiceRepo.find({
      where: { serviceId },
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findAll(filter?: FindStaffServicesFilter): Promise<StaffService[]> {
    const where: FindOptionsWhere<StaffServiceOrmEntity> = {};

    if (filter?.staffId) {
      where.staffId = filter.staffId;
    }
    if (filter?.serviceId) {
      where.serviceId = filter.serviceId;
    }
    if (filter?.isActive !== undefined) {
      where.isActive = filter.isActive;
    }

    const entities = await this.staffServiceRepo.find({
      where,
      order: { createdAt: 'DESC' },
    });

    return entities.map((entity) => this.toDomain(entity));
  }

  async delete(id: string): Promise<void> {
    await this.staffServiceRepo.delete(id);
  }

  private toDomain(entity: StaffServiceOrmEntity): StaffService {
    const properties: StaffServiceProperties = {
      id: entity.id,
      staffId: entity.staffId,
      serviceId: entity.serviceId,
      priceOverride: entity.priceOverride,
      durationOverrideMinutes: entity.durationOverrideMinutes,
      depositOverride: entity.depositOverride,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };

    return StaffService.rehydrate(properties);
  }

  private toEntity(staffService: StaffService): StaffServiceOrmEntity {
    const props = staffService.toProperties();
    const entity = new StaffServiceOrmEntity();
    entity.id = props.id;
    entity.staffId = props.staffId;
    entity.serviceId = props.serviceId;
    entity.priceOverride = props.priceOverride;
    entity.durationOverrideMinutes = props.durationOverrideMinutes;
    entity.depositOverride = props.depositOverride;
    entity.isActive = props.isActive;
    entity.createdAt = props.createdAt;
    entity.updatedAt = props.updatedAt;
    return entity;
  }

  private isUniqueViolation(error: unknown): boolean {
    if (
      typeof error !== 'object' ||
      error === null ||
      !('driverError' in error)
    ) {
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
