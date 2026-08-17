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
import { CreateServiceCategoryUseCase } from '../../application/use-cases/create-service-category.use-case';
import { DeleteServiceCategoryUseCase } from '../../application/use-cases/delete-service-category.use-case';
import { FindServiceCategoryUseCase } from '../../application/use-cases/find-service-category.use-case';
import { FindServiceCategoriesUseCase } from '../../application/use-cases/find-service-categories.use-case';
import { FindClinicServiceCategoriesUseCase } from '../../application/use-cases/find-clinic-service-categories.use-case';
import { UpdateServiceCategoryUseCase } from '../../application/use-cases/update-service-category.use-case';
import { ServiceCategoriesExceptionFilter } from './service-categories-exception.filter';
import { CreateServiceCategoryRequest } from './dto/create-service-category.request';
import { UpdateServiceCategoryRequest } from './dto/update-service-category.request';
import { ServiceCategoryResponse } from './dto/service-category.response';

@ApiTags('Service Categories')
@Controller()
@UseFilters(ServiceCategoriesExceptionFilter)
export class ServiceCategoriesController {
  constructor(
    private readonly createCategory: CreateServiceCategoryUseCase,
    private readonly updateCategory: UpdateServiceCategoryUseCase,
    private readonly findCategory: FindServiceCategoryUseCase,
    private readonly findCategories: FindServiceCategoriesUseCase,
    private readonly findClinicCategories: FindClinicServiceCategoriesUseCase,
    private readonly deleteCategory: DeleteServiceCategoryUseCase,
  ) {}

  @Post('service-categories')
  @ApiOperation({ summary: 'Create a new service category' })
  @ApiResponse({ status: 201, type: ServiceCategoryResponse })
  async create(
    @Body() request: CreateServiceCategoryRequest,
  ): Promise<ServiceCategoryResponse> {
    const output = await this.createCategory.execute(request);
    return ServiceCategoryResponse.from(output);
  }

  @Get('service-categories')
  @ApiOperation({ summary: 'Get all service categories' })
  @ApiResponse({ status: 200, type: [ServiceCategoryResponse] })
  async findAll(): Promise<ServiceCategoryResponse[]> {
    const outputs = await this.findCategories.execute();
    return outputs.map((output) => ServiceCategoryResponse.from(output));
  }

  @Get('clinics/:clinicId/service-categories')
  @ApiOperation({ summary: 'Get service categories of a specific clinic' })
  @ApiResponse({ status: 200, type: [ServiceCategoryResponse] })
  async findByClinic(
    @Param('clinicId') clinicId: string,
  ): Promise<ServiceCategoryResponse[]> {
    const outputs = await this.findClinicCategories.execute(clinicId);
    return outputs.map((output) => ServiceCategoryResponse.from(output));
  }

  @Get('service-categories/:id')
  @ApiOperation({ summary: 'Get service category by ID' })
  @ApiResponse({ status: 200, type: ServiceCategoryResponse })
  async findOne(@Param('id') id: string): Promise<ServiceCategoryResponse> {
    const output = await this.findCategory.execute(id);
    return ServiceCategoryResponse.from(output);
  }

  @Patch('service-categories/:id')
  @ApiOperation({ summary: 'Update an existing service category' })
  @ApiResponse({ status: 200, type: ServiceCategoryResponse })
  async update(
    @Param('id') id: string,
    @Body() request: UpdateServiceCategoryRequest,
  ): Promise<ServiceCategoryResponse> {
    const output = await this.updateCategory.execute(id, request);
    return ServiceCategoryResponse.from(output);
  }

  @Delete('service-categories/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft-delete a service category' })
  @ApiResponse({ status: 204 })
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteCategory.execute(id);
  }
}
