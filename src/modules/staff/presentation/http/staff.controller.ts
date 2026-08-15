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
  Query,
  UseFilters,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateStaffUseCase } from '../../application/use-cases/create-staff.use-case';
import { DeleteStaffUseCase } from '../../application/use-cases/delete-staff.use-case';
import { FindStaffUseCase } from '../../application/use-cases/find-staff.use-case';
import { FindStaffMembersUseCase } from '../../application/use-cases/find-staff-members.use-case';
import { UpdateStaffUseCase } from '../../application/use-cases/update-staff.use-case';
import { AssignStaffToBranchUseCase } from '../../application/use-cases/assign-staff-to-branch.use-case';
import { RemoveStaffFromBranchUseCase } from '../../application/use-cases/remove-staff-from-branch.use-case';
import { StaffExceptionFilter } from './staff-exception.filter';
import { CreateStaffRequest } from './dto/create-staff.request';
import { UpdateStaffRequest } from './dto/update-staff.request';
import { AssignBranchRequest } from './dto/assign-branch.request';
import { StaffResponse } from './dto/staff.response';

@ApiTags('Staff')
@Controller()
@UseFilters(StaffExceptionFilter)
export class StaffController {
  constructor(
    private readonly createStaff: CreateStaffUseCase,
    private readonly updateStaff: UpdateStaffUseCase,
    private readonly findStaff: FindStaffUseCase,
    private readonly findStaffMembers: FindStaffMembersUseCase,
    private readonly assignStaffToBranch: AssignStaffToBranchUseCase,
    private readonly removeStaffFromBranch: RemoveStaffFromBranchUseCase,
    private readonly deleteStaff: DeleteStaffUseCase,
  ) {}

  @Post('staff')
  @ApiOperation({ summary: 'Create a new staff member profile' })
  @ApiResponse({ status: 201, type: StaffResponse })
  async create(@Body() request: CreateStaffRequest): Promise<StaffResponse> {
    const output = await this.createStaff.execute(request);
    return StaffResponse.from(output);
  }

  @Get('staff')
  @ApiOperation({ summary: 'Get all staff members' })
  @ApiQuery({ name: 'clinicId', required: false, description: 'Filter staff by clinic UUID' })
  @ApiResponse({ status: 200, type: [StaffResponse] })
  async findAll(@Query('clinicId') clinicId?: string): Promise<StaffResponse[]> {
    const outputs = await this.findStaffMembers.execute(clinicId);
    return outputs.map((output) => StaffResponse.from(output));
  }

  @Get('clinics/:clinicId/staff')
  @ApiOperation({ summary: 'Get staff members by clinic ID' })
  @ApiResponse({ status: 200, type: [StaffResponse] })
  async findByClinic(@Param('clinicId') clinicId: string): Promise<StaffResponse[]> {
    const outputs = await this.findStaffMembers.execute(clinicId);
    return outputs.map((output) => StaffResponse.from(output));
  }

  @Get('staff/:id')
  @ApiOperation({ summary: 'Get staff member profile by ID' })
  @ApiResponse({ status: 200, type: StaffResponse })
  async findOne(@Param('id') id: string): Promise<StaffResponse> {
    const output = await this.findStaff.execute(id);
    return StaffResponse.from(output);
  }

  @Patch('staff/:id')
  @ApiOperation({ summary: 'Update an existing staff member profile' })
  @ApiResponse({ status: 200, type: StaffResponse })
  async update(
    @Param('id') id: string,
    @Body() request: UpdateStaffRequest,
  ): Promise<StaffResponse> {
    const output = await this.updateStaff.execute(id, request);
    return StaffResponse.from(output);
  }

  @Post('staff/:id/branches')
  @ApiOperation({ summary: 'Assign a staff member to a branch' })
  @ApiResponse({ status: 200, type: StaffResponse })
  async assignBranch(
    @Param('id') id: string,
    @Body() request: AssignBranchRequest,
  ): Promise<StaffResponse> {
    const output = await this.assignStaffToBranch.execute({
      staffId: id,
      branchId: request.branchId,
      isPrimary: request.isPrimary,
    });
    return StaffResponse.from(output);
  }

  @Delete('staff/:id/branches/:branchId')
  @ApiOperation({ summary: 'Unassign a staff member from a branch' })
  @ApiResponse({ status: 200, type: StaffResponse })
  async removeBranch(
    @Param('id') id: string,
    @Param('branchId') branchId: string,
  ): Promise<StaffResponse> {
    const output = await this.removeStaffFromBranch.execute(id, branchId);
    return StaffResponse.from(output);
  }

  @Delete('staff/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft-delete a staff member profile' })
  @ApiResponse({ status: 204 })
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteStaff.execute(id);
  }
}
