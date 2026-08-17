import { DeleteServiceUseCase } from './delete-service.use-case';
import { Service } from '../../domain/entities/service';
import { ServiceNotFoundError } from '../../domain/errors/service.errors';
import type { ServiceRepository } from '../../domain/repositories/service.repository';

describe('DeleteServiceUseCase', () => {
  let useCase: DeleteServiceUseCase;
  let mockServicesRepo: jest.Mocked<ServiceRepository>;

  beforeEach(() => {
    mockServicesRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByClinicIdAndSlug: jest.fn(),
      findByClinicId: jest.fn(),
      findByCategoryId: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new DeleteServiceUseCase(mockServicesRepo);
  });

  it('deletes a service if found', async () => {
    const service = Service.create({
      id: 'service-1',
      clinicId: 'clinic-1',
      categoryId: 'cat-1',
      name: 'Delete Service',
      durationMinutes: 30,
      price: 100,
    });

    mockServicesRepo.findById.mockResolvedValue(service);

    await useCase.execute('service-1');

    expect(mockServicesRepo.delete).toHaveBeenCalledWith('service-1');
  });

  it('throws ServiceNotFoundError if service does not exist', async () => {
    mockServicesRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute('missing-id')).rejects.toThrow(ServiceNotFoundError);
  });
});
