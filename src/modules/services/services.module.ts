import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicsModule } from '../clinics/clinics.module';
import { ServiceCategoriesModule } from '../service-categories/service-categories.module';
import { CreateServiceUseCase } from './application/use-cases/create-service.use-case';
import { DeleteServiceUseCase } from './application/use-cases/delete-service.use-case';
import { FindServiceUseCase } from './application/use-cases/find-service.use-case';
import { FindServicesUseCase } from './application/use-cases/find-services.use-case';
import { FindClinicServicesUseCase } from './application/use-cases/find-clinic-services.use-case';
import { FindCategoryServicesUseCase } from './application/use-cases/find-category-services.use-case';
import { UpdateServiceUseCase } from './application/use-cases/update-service.use-case';
import { SERVICE_ID_GENERATOR } from './application/ports/service-id-generator';
import { SERVICE_REPOSITORY } from './domain/repositories/service.repository';
import { ServiceOrmEntity } from './infrastructure/persistence/service.orm-entity';
import { TypeOrmServiceRepository } from './infrastructure/persistence/typeorm-service.repository';
import { UuidServiceIdGenerator } from './infrastructure/services/uuid-service-id-generator';
import { ServicesController } from './presentation/http/services.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceOrmEntity]),
    ClinicsModule,
    ServiceCategoriesModule,
  ],
  controllers: [ServicesController],
  providers: [
    CreateServiceUseCase,
    UpdateServiceUseCase,
    FindServiceUseCase,
    FindServicesUseCase,
    FindClinicServicesUseCase,
    FindCategoryServicesUseCase,
    DeleteServiceUseCase,
    { provide: SERVICE_REPOSITORY, useClass: TypeOrmServiceRepository },
    { provide: SERVICE_ID_GENERATOR, useClass: UuidServiceIdGenerator },
  ],
  exports: [
    CreateServiceUseCase,
    UpdateServiceUseCase,
    FindServiceUseCase,
    FindServicesUseCase,
    FindClinicServicesUseCase,
    FindCategoryServicesUseCase,
    DeleteServiceUseCase,
    SERVICE_REPOSITORY,
  ],
})
export class ServicesModule {}
