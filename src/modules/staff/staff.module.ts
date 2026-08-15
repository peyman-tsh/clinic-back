import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { ClinicsModule } from '../clinics/clinics.module';
import { BranchesModule } from '../branches/branches.module';
import { CreateStaffUseCase } from './application/use-cases/create-staff.use-case';
import { DeleteStaffUseCase } from './application/use-cases/delete-staff.use-case';
import { FindStaffUseCase } from './application/use-cases/find-staff.use-case';
import { FindStaffMembersUseCase } from './application/use-cases/find-staff-members.use-case';
import { UpdateStaffUseCase } from './application/use-cases/update-staff.use-case';
import { AssignStaffToBranchUseCase } from './application/use-cases/assign-staff-to-branch.use-case';
import { RemoveStaffFromBranchUseCase } from './application/use-cases/remove-staff-from-branch.use-case';
import { STAFF_ID_GENERATOR } from './application/ports/staff-id-generator';
import { STAFF_REPOSITORY } from './domain/repositories/staff.repository';
import { StaffOrmEntity } from './infrastructure/persistence/staff.orm-entity';
import { StaffBranchOrmEntity } from './infrastructure/persistence/staff-branch.orm-entity';
import { TypeOrmStaffRepository } from './infrastructure/persistence/typeorm-staff.repository';
import { UuidStaffIdGenerator } from './infrastructure/services/uuid-staff-id-generator';
import { StaffController } from './presentation/http/staff.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([StaffOrmEntity, StaffBranchOrmEntity]),
    UsersModule,
    ClinicsModule,
    BranchesModule,
  ],
  controllers: [StaffController],
  providers: [
    CreateStaffUseCase,
    UpdateStaffUseCase,
    FindStaffUseCase,
    FindStaffMembersUseCase,
    AssignStaffToBranchUseCase,
    RemoveStaffFromBranchUseCase,
    DeleteStaffUseCase,
    { provide: STAFF_REPOSITORY, useClass: TypeOrmStaffRepository },
    { provide: STAFF_ID_GENERATOR, useClass: UuidStaffIdGenerator },
  ],
  exports: [
    CreateStaffUseCase,
    UpdateStaffUseCase,
    FindStaffUseCase,
    FindStaffMembersUseCase,
    AssignStaffToBranchUseCase,
    RemoveStaffFromBranchUseCase,
    DeleteStaffUseCase,
    STAFF_REPOSITORY,
  ],
})
export class StaffModule {}
