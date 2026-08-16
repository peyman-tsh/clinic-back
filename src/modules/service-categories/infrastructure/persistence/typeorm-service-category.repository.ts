import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { ServiceCategory, ServiceCategoryProperties } from '../../domain/entities/service-category';
import { ServiceCategorySlugAlreadyInUseError } from '../../domain/errors/service-category.errors';
import type { ServiceCategoryRepository } from '../../domain/repositories/service-category.repository';
import { ServiceCategoryOrmEntity } from './service-category.orm-entity';

@Injectable()
export class TypeOrmServiceCategoryRepository implements ServiceCategoryRepository {
  constructor(
    @InjectRepository(ServiceCategoryOrmEntity)
    private readonly categoriesRepo: Repository<ServiceCategoryOrmEntity>,
  ) {}

  async save(category: ServiceCategory): Promise<void> {
    try {
      await this.categoriesRepo.save(this.toEntity(category));
    } catch (error: unknown) {
      if (this.isUniqueViolation(error)) {
        throw new ServiceCategorySlugAlreadyInUseError(category.slug, category.clinicId);
      }
      throw error;
    }
  }

  async findById(id: string): Promise<ServiceCategory | null> {
    const entity = await this.categoriesRepo.findOneBy({ id });
    return entity ? this.toDomain(entity) : null;
  }

  async findByClinicIdAndSlug(clinicId: string, slug: string): Promise<ServiceCategory | null> {
    const entity = await this.categoriesRepo
      .createQueryBuilder('category')
      .where('category.clinic_id = :clinicId', { clinicId })
      .andWhere('LOWER(category.slug) = LOWER(:slug)', { slug })
      .getOne();

    return entity ? this.toDomain(entity) : null;
  }

  async findByClinicId(clinicId: string): Promise<ServiceCategory[]> {
    const entities = await this.categoriesRepo.find({
      where: { clinicId },
      order: { sortOrder: 'ASC', createdAt: 'DESC', id: 'DESC' },
    });

    return entities.map((entity) => this.toDomain(entity));
  }

  async findAll(): Promise<ServiceCategory[]> {
    const entities = await this.categoriesRepo.find({
      order: { sortOrder: 'ASC', createdAt: 'DESC', id: 'DESC' },
    });

    return entities.map((entity) => this.toDomain(entity));
  }

  async delete(id: string): Promise<void> {
    await this.categoriesRepo.softDelete(id);
  }

  private toDomain(entity: ServiceCategoryOrmEntity): ServiceCategory {
    const properties: ServiceCategoryProperties = {
      id: entity.id,
      clinicId: entity.clinicId,
      name: entity.name,
      slug: entity.slug,
      description: entity.description,
      imageUrl: entity.imageUrl,
      sortOrder: entity.sortOrder,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };

    return ServiceCategory.rehydrate(properties);
  }

  private toEntity(category: ServiceCategory): ServiceCategoryOrmEntity {
    const props = category.toProperties();
    const entity = new ServiceCategoryOrmEntity();
    entity.id = props.id;
    entity.clinicId = props.clinicId;
    entity.name = props.name;
    entity.slug = props.slug;
    entity.description = props.description;
    entity.imageUrl = props.imageUrl;
    entity.sortOrder = props.sortOrder;
    entity.isActive = props.isActive;
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
