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
import { AssignStaffServiceUseCase } from '../../application/use-cases/assign-staff-service.use-case';
import { UpdateStaffServiceUseCase } from '../../application/use-cases/update-staff-service.use-case';
import { FindStaffServiceUseCase } from '../../application/use-cases/find-staff-service.use-case';
import { FindStaffServicesUseCase } from '../../application/use-cases/find-staff-services.use-case';
import { RemoveStaffServiceUseCase } from '../../application/use-cases/remove-staff-service.use-case';
import { StaffServiceExceptionFilter } from './staff-service-exception.filter';
import { AssignStaffServiceRequest } from './dto/assign-staff-service.request';
import { UpdateStaffServiceRequest } from './dto/update-staff-service.request';
import { StaffServiceResponse } from './dto/staff-service.response';

@ApiTags('Staff Services')
@Controller()
@UseFilters(StaffServiceExceptionFilter)
export class StaffServicesController {
  constructor(
    private readonly assignStaffService: AssignStaffServiceUseCase,
    private readonly updateStaffService: UpdateStaffServiceUseCase,
    private readonly findStaffService: FindStaffServiceUseCase,
    private readonly findStaffServices: FindStaffServicesUseCase,
    private readonly removeStaffService: RemoveStaffServiceUseCase,
  ) {}

  @Post('staff-services')
  @ApiOperation({
    summary: 'Assign a service to a staff member with optional overrides',
  })
  @ApiResponse({ status: 201, type: StaffServiceResponse })
  async assign(
    @Body() request: AssignStaffServiceRequest,
  ): Promise<StaffServiceResponse> {
    const output = await this.assignStaffService.execute(request);
    return StaffServiceResponse.from(output);
  }

  @Get('staff-services')
  @ApiOperation({
    summary: 'Find all staff-service assignments with optional filters',
  })
  @ApiQuery({
    name: 'staffId',
    required: false,
    description: 'Filter by staff UUID',
  })
  @ApiQuery({
    name: 'serviceId',
    required: false,
    description: 'Filter by service UUID',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    type: Boolean,
    description: 'Filter by active status',
  })
  @ApiResponse({ status: 200, type: [StaffServiceResponse] })
  async findAll(
    @Query('staffId') staffId?: string,
    @Query('serviceId') serviceId?: string,
    @Query('isActive') isActive?: string,
  ): Promise<StaffServiceResponse[]> {
    const parsedIsActive =
      isActive !== undefined
        ? isActive === 'true' || isActive === '1'
        : undefined;

    const outputs = await this.findStaffServices.execute({
      staffId,
      serviceId,
      isActive: parsedIsActive,
    });
    return outputs.map((output) => StaffServiceResponse.from(output));
  }

  @Get('staff/:staffId/services')
  @ApiOperation({
    summary: 'Get all services assigned to a specific staff member',
  })
  @ApiResponse({ status: 200, type: [StaffServiceResponse] })
  async findByStaff(
    @Param('staffId') staffId: string,
  ): Promise<StaffServiceResponse[]> {
    const outputs = await this.findStaffServices.execute({ staffId });
    return outputs.map((output) => StaffServiceResponse.from(output));
  }

  @Get('services/:serviceId/staff')
  @ApiOperation({
    summary: 'Get all staff members assigned to a specific service',
  })
  @ApiResponse({ status: 200, type: [StaffServiceResponse] })
  async findByService(
    @Param('serviceId') serviceId: string,
  ): Promise<StaffServiceResponse[]> {
    const outputs = await this.findStaffServices.execute({ serviceId });
    return outputs.map((output) => StaffServiceResponse.from(output));
  }

  @Get('staff-services/:id')
  @ApiOperation({ summary: 'Get a staff-service assignment by ID' })
  @ApiResponse({ status: 200, type: StaffServiceResponse })
  async findOne(@Param('id') id: string): Promise<StaffServiceResponse> {
    const output = await this.findStaffService.execute(id);
    return StaffServiceResponse.from(output);
  }

  @Patch('staff-services/:id')
  @ApiOperation({
    summary: 'Update overrides or active status for a staff-service assignment',
  })
  @ApiResponse({ status: 200, type: StaffServiceResponse })
  async update(
    @Param('id') id: string,
    @Body() request: UpdateStaffServiceRequest,
  ): Promise<StaffServiceResponse> {
    const output = await this.updateStaffService.execute(id, request);
    return StaffServiceResponse.from(output);
  }

  @Delete('staff-services/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a service assignment from a staff member' })
  @ApiResponse({ status: 204 })
  async remove(@Param('id') id: string): Promise<void> {
    await this.removeStaffService.execute(id);
  }
}
