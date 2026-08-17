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
import { CreateServiceUseCase } from '../../application/use-cases/create-service.use-case';
import { DeleteServiceUseCase } from '../../application/use-cases/delete-service.use-case';
import { FindServiceUseCase } from '../../application/use-cases/find-service.use-case';
import { FindServicesUseCase } from '../../application/use-cases/find-services.use-case';
import { FindClinicServicesUseCase } from '../../application/use-cases/find-clinic-services.use-case';
import { FindCategoryServicesUseCase } from '../../application/use-cases/find-category-services.use-case';
import { UpdateServiceUseCase } from '../../application/use-cases/update-service.use-case';
import { ServicesExceptionFilter } from './services-exception.filter';
import { CreateServiceRequest } from './dto/create-service.request';
import { UpdateServiceRequest } from './dto/update-service.request';
import { ServiceResponse } from './dto/service.response';

@ApiTags('Services')
@Controller()
@UseFilters(ServicesExceptionFilter)
export class ServicesController {
  constructor(
    private readonly createService: CreateServiceUseCase,
    private readonly updateService: UpdateServiceUseCase,
    private readonly findService: FindServiceUseCase,
    private readonly findServices: FindServicesUseCase,
    private readonly findClinicServices: FindClinicServicesUseCase,
    private readonly findCategoryServices: FindCategoryServicesUseCase,
    private readonly deleteService: DeleteServiceUseCase,
  ) {}

  @Post('services')
  @ApiOperation({ summary: 'Create a new service' })
  @ApiResponse({ status: 201, type: ServiceResponse })
  async create(
    @Body() request: CreateServiceRequest,
  ): Promise<ServiceResponse> {
    const output = await this.createService.execute(request);
    return ServiceResponse.from(output);
  }

  @Get('services')
  @ApiOperation({ summary: 'Get all services' })
  @ApiResponse({ status: 200, type: [ServiceResponse] })
  async findAll(): Promise<ServiceResponse[]> {
    const outputs = await this.findServices.execute();
    return outputs.map((output) => ServiceResponse.from(output));
  }

  @Get('clinics/:clinicId/services')
  @ApiOperation({ summary: 'Get services of a specific clinic' })
  @ApiResponse({ status: 200, type: [ServiceResponse] })
  async findByClinic(
    @Param('clinicId') clinicId: string,
  ): Promise<ServiceResponse[]> {
    const outputs = await this.findClinicServices.execute(clinicId);
    return outputs.map((output) => ServiceResponse.from(output));
  }

  @Get('service-categories/:categoryId/services')
  @ApiOperation({ summary: 'Get services of a specific category' })
  @ApiResponse({ status: 200, type: [ServiceResponse] })
  async findByCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<ServiceResponse[]> {
    const outputs = await this.findCategoryServices.execute(categoryId);
    return outputs.map((output) => ServiceResponse.from(output));
  }

  @Get('services/:id')
  @ApiOperation({ summary: 'Get service by ID' })
  @ApiResponse({ status: 200, type: ServiceResponse })
  async findOne(@Param('id') id: string): Promise<ServiceResponse> {
    const output = await this.findService.execute(id);
    return ServiceResponse.from(output);
  }

  @Patch('services/:id')
  @ApiOperation({ summary: 'Update an existing service' })
  @ApiResponse({ status: 200, type: ServiceResponse })
  async update(
    @Param('id') id: string,
    @Body() request: UpdateServiceRequest,
  ): Promise<ServiceResponse> {
    const output = await this.updateService.execute(id, request);
    return ServiceResponse.from(output);
  }

  @Delete('services/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft-delete a service' })
  @ApiResponse({ status: 204 })
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteService.execute(id);
  }
}
