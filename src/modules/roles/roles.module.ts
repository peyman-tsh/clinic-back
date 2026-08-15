import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatePermissionUseCase } from './application/use-cases/create-permission.use-case';
import { CreateRoleUseCase } from './application/use-cases/create-role.use-case';
import { DeletePermissionUseCase } from './application/use-cases/delete-permission.use-case';
import { DeleteRoleUseCase } from './application/use-cases/delete-role.use-case';
import { FindPermissionUseCase } from './application/use-cases/find-permission.use-case';
import { FindPermissionsUseCase } from './application/use-cases/find-permissions.use-case';
import { FindRolePermissionsUseCase } from './application/use-cases/find-role-permissions.use-case';
import { FindRoleUseCase } from './application/use-cases/find-role.use-case';
import { FindRolesUseCase } from './application/use-cases/find-roles.use-case';
import { FindUserRolesUseCase } from './application/use-cases/find-user-roles.use-case';
import { RemovePermissionFromRoleUseCase } from './application/use-cases/remove-permission-from-role.use-case';
import { RemoveRoleFromUserUseCase } from './application/use-cases/remove-role-from-user.use-case';
import { UpdatePermissionUseCase } from './application/use-cases/update-permission.use-case';
import { UpdateRoleUseCase } from './application/use-cases/update-role.use-case';
import { AssignPermissionToRoleUseCase } from './application/use-cases/assign-permission-to-role.use-case';
import { AssignRoleToUserUseCase } from './application/use-cases/assign-role-to-user.use-case';
import { ROLE_ID_GENERATOR } from './application/ports/role-id-generator';
import { PERMISSION_REPOSITORY } from './domain/repositories/permission.repository';
import { ROLE_ASSIGNMENT_REPOSITORY } from './domain/repositories/role-assignment.repository';
import { ROLE_REPOSITORY } from './domain/repositories/role.repository';
import { PermissionOrmEntity } from './infrastructure/persistence/permission.orm-entity';
import { RolePermissionOrmEntity } from './infrastructure/persistence/role-permission.orm-entity';
import { RoleOrmEntity } from './infrastructure/persistence/role.orm-entity';
import { TypeOrmPermissionRepository } from './infrastructure/persistence/typeorm-permission.repository';
import { TypeOrmRoleAssignmentRepository } from './infrastructure/persistence/typeorm-role-assignment.repository';
import { TypeOrmRoleRepository } from './infrastructure/persistence/typeorm-role.repository';
import { UserRoleOrmEntity } from './infrastructure/persistence/user-role.orm-entity';
import { UuidRoleIdGenerator } from './infrastructure/services/uuid-role-id-generator';
import { UserOrmEntity } from '../users/infrastructure/persistence/user.orm-entity';
import { PermissionsController } from './presentation/http/permissions.controller';
import { RoleAssignmentsController } from './presentation/http/role-assignments.controller';
import { RolesController } from './presentation/http/roles.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserOrmEntity,
      UserRoleOrmEntity,
      RoleOrmEntity,
      PermissionOrmEntity,
      RolePermissionOrmEntity,
    ]),
  ],
  controllers: [RolesController, PermissionsController, RoleAssignmentsController],
  providers: [
    CreateRoleUseCase,
    FindRolesUseCase,
    FindRoleUseCase,
    UpdateRoleUseCase,
    DeleteRoleUseCase,
    CreatePermissionUseCase,
    FindPermissionsUseCase,
    FindPermissionUseCase,
    UpdatePermissionUseCase,
    DeletePermissionUseCase,
    AssignPermissionToRoleUseCase,
    RemovePermissionFromRoleUseCase,
    FindRolePermissionsUseCase,
    AssignRoleToUserUseCase,
    RemoveRoleFromUserUseCase,
    FindUserRolesUseCase,
    { provide: ROLE_REPOSITORY, useClass: TypeOrmRoleRepository },
    { provide: PERMISSION_REPOSITORY, useClass: TypeOrmPermissionRepository },
    {
      provide: ROLE_ASSIGNMENT_REPOSITORY,
      useClass: TypeOrmRoleAssignmentRepository,
    },
    { provide: ROLE_ID_GENERATOR, useClass: UuidRoleIdGenerator },
  ],
})
export class RolesModule {}
