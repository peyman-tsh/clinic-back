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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateRoleUseCase } from '../../application/use-cases/create-role.use-case';
import { DeleteRoleUseCase } from '../../application/use-cases/delete-role.use-case';
import { FindRoleUseCase } from '../../application/use-cases/find-role.use-case';
import { FindRolesUseCase } from '../../application/use-cases/find-roles.use-case';
import { UpdateRoleUseCase } from '../../application/use-cases/update-role.use-case';
import { CreateRoleRequest } from './dto/create-role.request';
import { RoleResponse } from './dto/role.response';
import { UpdateRoleRequest } from './dto/update-role.request';
import { RolesExceptionFilter } from './roles-exception.filter';

@ApiTags('roles')
@ApiBearerAuth()
@Controller('roles')
@UseFilters(RolesExceptionFilter)
export class RolesController {
  constructor(
    private readonly createRole: CreateRoleUseCase,
    private readonly findRoles: FindRolesUseCase,
    private readonly findRole: FindRoleUseCase,
    private readonly updateRole: UpdateRoleUseCase,
    private readonly deleteRole: DeleteRoleUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiCreatedResponse({
    description: 'Role created successfully',
    type: RoleResponse,
  })
  async create(@Body() request: CreateRoleRequest): Promise<RoleResponse> {
    return RoleResponse.from(await this.createRole.execute(request));
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiOkResponse({ description: 'List of roles', type: [RoleResponse] })
  async findAll(): Promise<RoleResponse[]> {
    return (await this.findRoles.execute()).map(RoleResponse.from);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a role by ID' })
  @ApiOkResponse({ description: 'Role found', type: RoleResponse })
  async findOne(@Param('id') id: string): Promise<RoleResponse> {
    return RoleResponse.from(await this.findRole.execute(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a role' })
  @ApiOkResponse({
    description: 'Role updated successfully',
    type: RoleResponse,
  })
  async update(
    @Param('id') id: string,
    @Body() request: UpdateRoleRequest,
  ): Promise<RoleResponse> {
    return RoleResponse.from(await this.updateRole.execute(id, request));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a role' })
  @ApiNoContentResponse({ description: 'Role deleted successfully' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteRole.execute(id);
  }
}
