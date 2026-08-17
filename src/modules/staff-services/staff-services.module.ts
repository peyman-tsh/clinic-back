import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffModule } from '../staff/staff.module';
import { ServicesModule } from '../services/services.module';
import { AssignStaffServiceUseCase } from './application/use-cases/assign-staff-service.use-case';
import { UpdateStaffServiceUseCase } from './application/use-cases/update-staff-service.use-case';
import { FindStaffServiceUseCase } from './application/use-cases/find-staff-service.use-case';
import { FindStaffServicesUseCase } from './application/use-cases/find-staff-services.use-case';
import { RemoveStaffServiceUseCase } from './application/use-cases/remove-staff-service.use-case';
import { STAFF_SERVICE_ID_GENERATOR } from './application/ports/staff-service-id-generator';
import { STAFF_SERVICE_REPOSITORY } from './domain/repositories/staff-service.repository';
import { StaffServiceOrmEntity } from './infrastructure/persistence/staff-service.orm-entity';
import { TypeOrmStaffServiceRepository } from './infrastructure/persistence/typeorm-staff-service.repository';
import { UuidStaffServiceIdGenerator } from './infrastructure/services/uuid-staff-service-id-generator';
import { StaffServicesController } from './presentation/http/staff-services.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([StaffServiceOrmEntity]),
    StaffModule,
    ServicesModule,
  ],
  controllers: [StaffServicesController],
  providers: [
    AssignStaffServiceUseCase,
    UpdateStaffServiceUseCase,
    FindStaffServiceUseCase,
    FindStaffServicesUseCase,
    RemoveStaffServiceUseCase,
    {
      provide: STAFF_SERVICE_REPOSITORY,
      useClass: TypeOrmStaffServiceRepository,
    },
    {
      provide: STAFF_SERVICE_ID_GENERATOR,
      useClass: UuidStaffServiceIdGenerator,
    },
  ],
  exports: [
    AssignStaffServiceUseCase,
    UpdateStaffServiceUseCase,
    FindStaffServiceUseCase,
    FindStaffServicesUseCase,
    RemoveStaffServiceUseCase,
    STAFF_SERVICE_REPOSITORY,
  ],
})
export class StaffServicesModule {}
