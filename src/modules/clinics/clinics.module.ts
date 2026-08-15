import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateClinicUseCase } from './application/use-cases/create-clinic.use-case';
import { DeleteClinicUseCase } from './application/use-cases/delete-clinic.use-case';
import { FindClinicUseCase } from './application/use-cases/find-clinic.use-case';
import { FindClinicsUseCase } from './application/use-cases/find-clinics.use-case';
import { UpdateClinicUseCase } from './application/use-cases/update-clinic.use-case';
import { CLINIC_ID_GENERATOR } from './application/ports/clinic-id-generator';
import { CLINIC_REPOSITORY } from './domain/repositories/clinic.repository';
import { ClinicOrmEntity } from './infrastructure/persistence/clinic.orm-entity';
import { TypeOrmClinicRepository } from './infrastructure/persistence/typeorm-clinic.repository';
import { UuidClinicIdGenerator } from './infrastructure/services/uuid-clinic-id-generator';
import { ClinicsController } from './presentation/http/clinics.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ClinicOrmEntity])],
  controllers: [ClinicsController],
  providers: [
    CreateClinicUseCase,
    UpdateClinicUseCase,
    FindClinicUseCase,
    FindClinicsUseCase,
    DeleteClinicUseCase,
    { provide: CLINIC_REPOSITORY, useClass: TypeOrmClinicRepository },
    { provide: CLINIC_ID_GENERATOR, useClass: UuidClinicIdGenerator },
  ],
  exports: [
    CreateClinicUseCase,
    UpdateClinicUseCase,
    FindClinicUseCase,
    FindClinicsUseCase,
    DeleteClinicUseCase,
    CLINIC_REPOSITORY,
  ],
})
export class ClinicsModule {}
