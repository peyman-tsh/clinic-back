import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicsModule } from '../clinics/clinics.module';
import { CreateBranchUseCase } from './application/use-cases/create-branch.use-case';
import { DeleteBranchUseCase } from './application/use-cases/delete-branch.use-case';
import { FindBranchUseCase } from './application/use-cases/find-branch.use-case';
import { FindBranchesUseCase } from './application/use-cases/find-branches.use-case';
import { FindClinicBranchesUseCase } from './application/use-cases/find-clinic-branches.use-case';
import { UpdateBranchUseCase } from './application/use-cases/update-branch.use-case';
import { BRANCH_ID_GENERATOR } from './application/ports/branch-id-generator';
import { BRANCH_REPOSITORY } from './domain/repositories/branch.repository';
import { BranchOrmEntity } from './infrastructure/persistence/branch.orm-entity';
import { TypeOrmBranchRepository } from './infrastructure/persistence/typeorm-branch.repository';
import { UuidBranchIdGenerator } from './infrastructure/services/uuid-branch-id-generator';
import { BranchesController } from './presentation/http/branches.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BranchOrmEntity]), ClinicsModule],
  controllers: [BranchesController],
  providers: [
    CreateBranchUseCase,
    UpdateBranchUseCase,
    FindBranchUseCase,
    FindBranchesUseCase,
    FindClinicBranchesUseCase,
    DeleteBranchUseCase,
    { provide: BRANCH_REPOSITORY, useClass: TypeOrmBranchRepository },
    { provide: BRANCH_ID_GENERATOR, useClass: UuidBranchIdGenerator },
  ],
  exports: [
    CreateBranchUseCase,
    UpdateBranchUseCase,
    FindBranchUseCase,
    FindBranchesUseCase,
    FindClinicBranchesUseCase,
    DeleteBranchUseCase,
    BRANCH_REPOSITORY,
  ],
})
export class BranchesModule {}
