import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Service, ServiceProperties } from '../../domain/entities/service';
import { ServiceSlugAlreadyInUseError } from '../../domain/errors/service.errors';
import type { ServiceRepository } from '../../domain/repositories/service.repository';
import { ServiceOrmEntity } from './service.orm-entity';

@Injectable()
export class TypeOrmServiceRepository implements ServiceRepository {
  constructor(
    @InjectRepository(ServiceOrmEntity)
    private readonly servicesRepo: Repository<ServiceOrmEntity>,
  ) {}

  async save(service: Service): Promise<void> {
    try {
      await this.servicesRepo.save(this.toEntity(service));
    } catch (error: unknown) {
      if (this.isUniqueViolation(error)) {
        throw new ServiceSlugAlreadyInUseError(service.slug, service.clinicId);
      }
      throw error;
    }
  }

  async findById(id: string): Promise<Service | null> {
    const entity = await this.servicesRepo.findOneBy({ id });
    return entity ? this.toDomain(entity) : null;
  }

  async findByClinicIdAndSlug(
    clinicId: string,
    slug: string,
  ): Promise<Service | null> {
    const entity = await this.servicesRepo
      .createQueryBuilder('service')
      .where('service.clinic_id = :clinicId', { clinicId })
      .andWhere('LOWER(service.slug) = LOWER(:slug)', { slug })
      .getOne();

    return entity ? this.toDomain(entity) : null;
  }

  async findByClinicId(clinicId: string): Promise<Service[]> {
    const entities = await this.servicesRepo.find({
      where: { clinicId },
      order: { sortOrder: 'ASC', createdAt: 'DESC', id: 'DESC' },
    });

    return entities.map((entity) => this.toDomain(entity));
  }

  async findByCategoryId(categoryId: string): Promise<Service[]> {
    const entities = await this.servicesRepo.find({
      where: { categoryId },
      order: { sortOrder: 'ASC', createdAt: 'DESC', id: 'DESC' },
    });

    return entities.map((entity) => this.toDomain(entity));
  }

  async findAll(): Promise<Service[]> {
    const entities = await this.servicesRepo.find({
      order: { sortOrder: 'ASC', createdAt: 'DESC', id: 'DESC' },
    });

    return entities.map((entity) => this.toDomain(entity));
  }

  async delete(id: string): Promise<void> {
    await this.servicesRepo.softDelete(id);
  }

  private toDomain(entity: ServiceOrmEntity): Service {
    const properties: ServiceProperties = {
      id: entity.id,
      clinicId: entity.clinicId,
      categoryId: entity.categoryId,
      name: entity.name,
      slug: entity.slug,
      description: entity.description,
      imageUrl: entity.imageUrl,
      durationMinutes: entity.durationMinutes,
      bufferBeforeMinutes: entity.bufferBeforeMinutes,
      bufferAfterMinutes: entity.bufferAfterMinutes,
      price: entity.price,
      depositAmount: entity.depositAmount,
      isActive: entity.isActive,
      sortOrder: entity.sortOrder,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };

    return Service.rehydrate(properties);
  }

  private toEntity(service: Service): ServiceOrmEntity {
    const props = service.toProperties();
    const entity = new ServiceOrmEntity();
    entity.id = props.id;
    entity.clinicId = props.clinicId;
    entity.categoryId = props.categoryId;
    entity.name = props.name;
    entity.slug = props.slug;
    entity.description = props.description;
    entity.imageUrl = props.imageUrl;
    entity.durationMinutes = props.durationMinutes;
    entity.bufferBeforeMinutes = props.bufferBeforeMinutes;
    entity.bufferAfterMinutes = props.bufferAfterMinutes;
    entity.price = props.price;
    entity.depositAmount = props.depositAmount;
    entity.isActive = props.isActive;
    entity.sortOrder = props.sortOrder;
    entity.createdAt = props.createdAt;
    entity.updatedAt = props.updatedAt;
    entity.deletedAt = props.deletedAt;
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
