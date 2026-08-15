import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseFilters,
} from '@nestjs/common';
import { AssignPermissionToRoleUseCase } from '../../application/use-cases/assign-permission-to-role.use-case';
import { AssignRoleToUserUseCase } from '../../application/use-cases/assign-role-to-user.use-case';
import { FindRolePermissionsUseCase } from '../../application/use-cases/find-role-permissions.use-case';
import { FindUserRolesUseCase } from '../../application/use-cases/find-user-roles.use-case';
import { RemovePermissionFromRoleUseCase } from '../../application/use-cases/remove-permission-from-role.use-case';
import { RemoveRoleFromUserUseCase } from '../../application/use-cases/remove-role-from-user.use-case';
import { PermissionResponse } from './dto/permission.response';
import { RoleResponse } from './dto/role.response';
import { RolesExceptionFilter } from './roles-exception.filter';

@Controller()
@UseFilters(RolesExceptionFilter)
export class RoleAssignmentsController {
  constructor(
    private readonly assignPermission: AssignPermissionToRoleUseCase,
    private readonly removePermission: RemovePermissionFromRoleUseCase,
    private readonly findPermissions: FindRolePermissionsUseCase,
    private readonly assignRole: AssignRoleToUserUseCase,
    private readonly removeRole: RemoveRoleFromUserUseCase,
    private readonly findRoles: FindUserRolesUseCase,
  ) {}

  @Post('roles/:roleId/permissions/:permissionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async assignPermissionToRole(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ): Promise<void> {
    await this.assignPermission.execute(roleId, permissionId);
  }

  @Delete('roles/:roleId/permissions/:permissionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removePermissionFromRole(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ): Promise<void> {
    await this.removePermission.execute(roleId, permissionId);
  }

  @Get('roles/:roleId/permissions')
  async findRolePermissions(
    @Param('roleId') roleId: string,
  ): Promise<PermissionResponse[]> {
    return (await this.findPermissions.execute(roleId)).map(PermissionResponse.from);
  }

  @Post('users/:userId/roles/:roleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async assignRoleToUser(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
  ): Promise<void> {
    await this.assignRole.execute(userId, roleId);
  }

  @Delete('users/:userId/roles/:roleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeRoleFromUser(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
  ): Promise<void> {
    await this.removeRole.execute(userId, roleId);
  }

  @Get('users/:userId/roles')
  async findUserRoles(
    @Param('userId') userId: string,
  ): Promise<RoleResponse[]> {
    return (await this.findRoles.execute(userId)).map(RoleResponse.from);
  }
}
