import { UpdateServiceUseCase } from './update-service.use-case';
import { Service } from '../../domain/entities/service';
import { ServiceNotFoundError } from '../../domain/errors/service.errors';
import type { ServiceRepository } from '../../domain/repositories/service.repository';
import type { ServiceCategoryRepository } from '../../../service-categories/domain/repositories/service-category.repository';

describe('UpdateServiceUseCase', () => {
  let useCase: UpdateServiceUseCase;
  let mockServicesRepo: jest.Mocked<ServiceRepository>;
  let mockCategoriesRepo: jest.Mocked<ServiceCategoryRepository>;

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

    mockCategoriesRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByClinicIdAndSlug: jest.fn(),
      findByClinicId: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new UpdateServiceUseCase(mockServicesRepo, mockCategoriesRepo);
  });

  it('updates an existing service successfully', async () => {
    const service = Service.create({
      id: 'service-uuid-1',
      clinicId: 'clinic-uuid-1',
      categoryId: 'category-uuid-1',
      name: 'Botox',
      durationMinutes: 30,
      price: 180,
    });

    mockServicesRepo.findById.mockResolvedValue(service);
    mockServicesRepo.findByClinicIdAndSlug.mockResolvedValue(null);

    const updated = await useCase.execute('service-uuid-1', {
      name: 'Botox Special',
      price: 200,
    });

    expect(updated.name).toBe('Botox Special');
    expect(updated.slug).toBe('botox-special');
    expect(updated.price).toBe(200);
    expect(mockServicesRepo.save).toHaveBeenCalled();
  });

  it('throws ServiceNotFoundError if service does not exist', async () => {
    mockServicesRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute('missing-id', {
        name: 'New Name',
      }),
    ).rejects.toThrow(ServiceNotFoundError);
  });
});
