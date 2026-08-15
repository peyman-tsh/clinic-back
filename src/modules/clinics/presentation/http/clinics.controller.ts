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
import { CreateClinicUseCase } from '../../application/use-cases/create-clinic.use-case';
import { DeleteClinicUseCase } from '../../application/use-cases/delete-clinic.use-case';
import { FindClinicUseCase } from '../../application/use-cases/find-clinic.use-case';
import { FindClinicsUseCase } from '../../application/use-cases/find-clinics.use-case';
import { UpdateClinicUseCase } from '../../application/use-cases/update-clinic.use-case';
import { ClinicsExceptionFilter } from './clinics-exception.filter';
import { CreateClinicRequest } from './dto/create-clinic.request';
import { UpdateClinicRequest } from './dto/update-clinic.request';
import { ClinicResponse } from './dto/clinic.response';

@ApiTags('Clinics')
@Controller('clinics')
@UseFilters(ClinicsExceptionFilter)
export class ClinicsController {
  constructor(
    private readonly createClinic: CreateClinicUseCase,
    private readonly updateClinic: UpdateClinicUseCase,
    private readonly findClinic: FindClinicUseCase,
    private readonly findClinics: FindClinicsUseCase,
    private readonly deleteClinic: DeleteClinicUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new clinic' })
  @ApiResponse({ status: 201, type: ClinicResponse })
  async create(@Body() request: CreateClinicRequest): Promise<ClinicResponse> {
    const output = await this.createClinic.execute(request);
    return ClinicResponse.from(output);
  }

  @Get()
  @ApiOperation({ summary: 'Get all clinics' })
  @ApiResponse({ status: 200, type: [ClinicResponse] })
  async findAll(): Promise<ClinicResponse[]> {
    const outputs = await this.findClinics.execute();
    return outputs.map((output) => ClinicResponse.from(output));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get clinic by ID' })
  @ApiResponse({ status: 200, type: ClinicResponse })
  async findOne(@Param('id') id: string): Promise<ClinicResponse> {
    const output = await this.findClinic.execute(id);
    return ClinicResponse.from(output);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing clinic' })
  @ApiResponse({ status: 200, type: ClinicResponse })
  async update(
    @Param('id') id: string,
    @Body() request: UpdateClinicRequest,
  ): Promise<ClinicResponse> {
    const output = await this.updateClinic.execute(id, request);
    return ClinicResponse.from(output);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft-delete a clinic' })
  @ApiResponse({ status: 24 })
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteClinic.execute(id);
  }
}
