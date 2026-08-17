import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicsModule } from '../clinics/clinics.module';
import { CreateServiceCategoryUseCase } from './application/use-cases/create-service-category.use-case';
import { DeleteServiceCategoryUseCase } from './application/use-cases/delete-service-category.use-case';
import { FindServiceCategoryUseCase } from './application/use-cases/find-service-category.use-case';
import { FindServiceCategoriesUseCase } from './application/use-cases/find-service-categories.use-case';
import { FindClinicServiceCategoriesUseCase } from './application/use-cases/find-clinic-service-categories.use-case';
import { UpdateServiceCategoryUseCase } from './application/use-cases/update-service-category.use-case';
import { SERVICE_CATEGORY_ID_GENERATOR } from './application/ports/service-category-id-generator';
import { SERVICE_CATEGORY_REPOSITORY } from './domain/repositories/service-category.repository';
import { ServiceCategoryOrmEntity } from './infrastructure/persistence/service-category.orm-entity';
import { TypeOrmServiceCategoryRepository } from './infrastructure/persistence/typeorm-service-category.repository';
import { UuidServiceCategoryIdGenerator } from './infrastructure/services/uuid-service-category-id-generator';
import { ServiceCategoriesController } from './presentation/http/service-categories.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceCategoryOrmEntity]),
    ClinicsModule,
  ],
  controllers: [ServiceCategoriesController],
  providers: [
    CreateServiceCategoryUseCase,
    UpdateServiceCategoryUseCase,
    FindServiceCategoryUseCase,
    FindServiceCategoriesUseCase,
    FindClinicServiceCategoriesUseCase,
    DeleteServiceCategoryUseCase,
    {
      provide: SERVICE_CATEGORY_REPOSITORY,
      useClass: TypeOrmServiceCategoryRepository,
    },
    {
      provide: SERVICE_CATEGORY_ID_GENERATOR,
      useClass: UuidServiceCategoryIdGenerator,
    },
  ],
  exports: [
    CreateServiceCategoryUseCase,
    UpdateServiceCategoryUseCase,
    FindServiceCategoryUseCase,
    FindServiceCategoriesUseCase,
    FindClinicServiceCategoriesUseCase,
    DeleteServiceCategoryUseCase,
    SERVICE_CATEGORY_REPOSITORY,
  ],
})
export class ServiceCategoriesModule {}
