import { Inject, Injectable } from '@nestjs/common';
import { ServiceNotFoundError } from '../../domain/errors/service.errors';
import { SERVICE_REPOSITORY, type ServiceRepository } from '../../domain/repositories/service.repository';

@Injectable()
export class DeleteServiceUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly servicesRepo: ServiceRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const service = await this.servicesRepo.findById(id);
    if (!service) {
      throw new ServiceNotFoundError(id);
    }
    await this.servicesRepo.delete(id);
  }
}
