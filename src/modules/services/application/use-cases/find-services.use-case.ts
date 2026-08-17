import { Inject, Injectable } from '@nestjs/common';
import { SERVICE_REPOSITORY, type ServiceRepository } from '../../domain/repositories/service.repository';
import { ServiceOutput } from '../dto/service.dto';

@Injectable()
export class FindServicesUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly servicesRepo: ServiceRepository,
  ) {}

  async execute(): Promise<ServiceOutput[]> {
    const list = await this.servicesRepo.findAll();
    return list.map((service) => ({
      ...service.toProperties(),
      totalOccupiedMinutes: service.totalOccupiedMinutes,
    }));
  }
}
