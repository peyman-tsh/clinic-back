import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseFilters,
} from '@nestjs/common';
import { CreatePermissionUseCase } from '../../application/use-cases/create-permission.use-case';
import { DeletePermissionUseCase } from '../../application/use-cases/delete-permission.use-case';
import { FindPermissionUseCase } from '../../application/use-cases/find-permission.use-case';
import { FindPermissionsUseCase } from '../../application/use-cases/find-permissions.use-case';
import { UpdatePermissionUseCase } from '../../application/use-cases/update-permission.use-case';
import { CreatePermissionRequest } from './dto/create-permission.request';
import { PermissionResponse } from './dto/permission.response';
import { UpdatePermissionRequest } from './dto/update-permission.request';
import { RolesExceptionFilter } from './roles-exception.filter';

@Controller('permissions')
@UseFilters(RolesExceptionFilter)
export class PermissionsController {
  constructor(
    private readonly createPermission: CreatePermissionUseCase,
    private readonly findPermissions: FindPermissionsUseCase,
    private readonly findPermission: FindPermissionUseCase,
    private readonly updatePermission: UpdatePermissionUseCase,
    private readonly deletePermission: DeletePermissionUseCase,
  ) {}

  @Post()
  async create(
    @Body() request: CreatePermissionRequest,
  ): Promise<PermissionResponse> {
    return PermissionResponse.from(
      await this.createPermission.execute(request),
    );
  }

  @Get()
  async findAll(): Promise<PermissionResponse[]> {
    return (await this.findPermissions.execute()).map(PermissionResponse.from);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PermissionResponse> {
    return PermissionResponse.from(await this.findPermission.execute(id));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() request: UpdatePermissionRequest,
  ): Promise<PermissionResponse> {
    return PermissionResponse.from(
      await this.updatePermission.execute(id, request),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.deletePermission.execute(id);
  }
}
