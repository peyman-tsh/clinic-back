import { Inject, Injectable } from '@nestjs/common';
import { ServiceNotFoundError } from '../../domain/errors/service.errors';
import {
  SERVICE_REPOSITORY,
  type ServiceRepository,
} from '../../domain/repositories/service.repository';
import { ServiceOutput } from '../dto/service.dto';

@Injectable()
export class FindServiceUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly servicesRepo: ServiceRepository,
  ) {}

  async execute(id: string): Promise<ServiceOutput> {
    const service = await this.servicesRepo.findById(id);
    if (!service) {
      throw new ServiceNotFoundError(id);
    }
    return {
      ...service.toProperties(),
      totalOccupiedMinutes: service.totalOccupiedMinutes,
    };
  }
}
