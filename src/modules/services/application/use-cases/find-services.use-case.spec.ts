import { FindServicesUseCase } from './find-services.use-case';
import { Service } from '../../domain/entities/service';
import type { ServiceRepository } from '../../domain/repositories/service.repository';

describe('FindServicesUseCase', () => {
  let useCase: FindServicesUseCase;
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

    useCase = new FindServicesUseCase(mockServicesRepo);
  });

  it('returns a list of all services', async () => {
    const s1 = Service.create({
      id: '1',
      clinicId: 'clinic-1',
      categoryId: 'cat-1',
      name: 'Botox',
      durationMinutes: 30,
      price: 180,
    });

    mockServicesRepo.findAll.mockResolvedValue([s1]);

    const results = await useCase.execute();
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Botox');
  });
});
