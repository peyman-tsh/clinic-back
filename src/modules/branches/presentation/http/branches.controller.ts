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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateBranchUseCase } from '../../application/use-cases/create-branch.use-case';
import { DeleteBranchUseCase } from '../../application/use-cases/delete-branch.use-case';
import { FindBranchUseCase } from '../../application/use-cases/find-branch.use-case';
import { FindBranchesUseCase } from '../../application/use-cases/find-branches.use-case';
import { FindClinicBranchesUseCase } from '../../application/use-cases/find-clinic-branches.use-case';
import { UpdateBranchUseCase } from '../../application/use-cases/update-branch.use-case';
import { BranchesExceptionFilter } from './branches-exception.filter';
import { CreateBranchRequest } from './dto/create-branch.request';
import { UpdateBranchRequest } from './dto/update-branch.request';
import { BranchResponse } from './dto/branch.response';

@ApiTags('Branches')
@Controller()
@UseFilters(BranchesExceptionFilter)
export class BranchesController {
  constructor(
    private readonly createBranch: CreateBranchUseCase,
    private readonly updateBranch: UpdateBranchUseCase,
    private readonly findBranch: FindBranchUseCase,
    private readonly findBranches: FindBranchesUseCase,
    private readonly findClinicBranches: FindClinicBranchesUseCase,
    private readonly deleteBranch: DeleteBranchUseCase,
  ) {}

  @Post('branches')
  @ApiOperation({ summary: 'Create a new branch' })
  @ApiResponse({ status: 201, type: BranchResponse })
  async create(@Body() request: CreateBranchRequest): Promise<BranchResponse> {
    const output = await this.createBranch.execute(request);
    return BranchResponse.from(output);
  }

  @Get('branches')
  @ApiOperation({ summary: 'Get all branches' })
  @ApiResponse({ status: 200, type: [BranchResponse] })
  async findAll(): Promise<BranchResponse[]> {
    const outputs = await this.findBranches.execute();
    return outputs.map((output) => BranchResponse.from(output));
  }

  @Get('clinics/:clinicId/branches')
  @ApiOperation({ summary: 'Get all branches of a specific clinic' })
  @ApiResponse({ status: 200, type: [BranchResponse] })
  async findByClinic(@Param('clinicId') clinicId: string): Promise<BranchResponse[]> {
    const outputs = await this.findClinicBranches.execute(clinicId);
    return outputs.map((output) => BranchResponse.from(output));
  }

  @Get('branches/:id')
  @ApiOperation({ summary: 'Get branch by ID' })
  @ApiResponse({ status: 200, type: BranchResponse })
  async findOne(@Param('id') id: string): Promise<BranchResponse> {
    const output = await this.findBranch.execute(id);
    return BranchResponse.from(output);
  }

  @Patch('branches/:id')
  @ApiOperation({ summary: 'Update an existing branch' })
  @ApiResponse({ status: 200, type: BranchResponse })
  async update(
    @Param('id') id: string,
    @Body() request: UpdateBranchRequest,
  ): Promise<BranchResponse> {
    const output = await this.updateBranch.execute(id, request);
    return BranchResponse.from(output);
  }

  @Delete('branches/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft-delete a branch' })
  @ApiResponse({ status: 204 })
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteBranch.execute(id);
  }
}
