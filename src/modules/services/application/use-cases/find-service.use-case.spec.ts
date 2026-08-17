import { FindServiceUseCase } from './find-service.use-case';
import { Service } from '../../domain/entities/service';
import { ServiceNotFoundError } from '../../domain/errors/service.errors';
import type { ServiceRepository } from '../../domain/repositories/service.repository';

describe('FindServiceUseCase', () => {
  let useCase: FindServiceUseCase;
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

    useCase = new FindServiceUseCase(mockServicesRepo);
  });

  it('returns a service if found', async () => {
    const service = Service.create({
      id: 'service-1',
      clinicId: 'clinic-1',
      categoryId: 'cat-1',
      name: 'Lip Filler',
      durationMinutes: 45,
      price: 220,
    });

    mockServicesRepo.findById.mockResolvedValue(service);

    const result = await useCase.execute('service-1');
    expect(result.id).toBe('service-1');
    expect(result.name).toBe('Lip Filler');
    expect(result.price).toBe(220);
  });

  it('throws ServiceNotFoundError if service does not exist', async () => {
    mockServicesRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute('missing-id')).rejects.toThrow(ServiceNotFoundError);
  });
});
