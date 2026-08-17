import { FindCategoryServicesUseCase } from './find-category-services.use-case';
import { Service } from '../../domain/entities/service';
import { ServiceCategory } from '../../../service-categories/domain/entities/service-category';
import { ServiceCategoryNotFoundError } from '../../../service-categories/domain/errors/service-category.errors';
import type { ServiceRepository } from '../../domain/repositories/service.repository';
import type { ServiceCategoryRepository } from '../../../service-categories/domain/repositories/service-category.repository';

describe('FindCategoryServicesUseCase', () => {
  let useCase: FindCategoryServicesUseCase;
  let mockServicesRepo: jest.Mocked<ServiceRepository>;
  let mockCategoriesRepo: jest.Mocked<ServiceCategoryRepository>;

  const mockCategory = ServiceCategory.create({
    id: 'category-uuid-1',
    clinicId: 'clinic-uuid-1',
    name: 'Injectables',
  });

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

    useCase = new FindCategoryServicesUseCase(
      mockServicesRepo,
      mockCategoriesRepo,
    );
  });

  it('returns all services belonging to a valid category', async () => {
    mockCategoriesRepo.findById.mockResolvedValue(mockCategory);

    const s1 = Service.create({
      id: 's-1',
      clinicId: 'clinic-uuid-1',
      categoryId: 'category-uuid-1',
      name: 'Botox',
      durationMinutes: 30,
      price: 180,
    });

    mockServicesRepo.findByCategoryId.mockResolvedValue([s1]);

    const results = await useCase.execute('category-uuid-1');
    expect(results).toHaveLength(1);
    expect(results[0].categoryId).toBe('category-uuid-1');
    expect(results[0].name).toBe('Botox');
  });

  it('throws ServiceCategoryNotFoundError if parent category does not exist', async () => {
    mockCategoriesRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute('missing-category')).rejects.toThrow(
      ServiceCategoryNotFoundError,
    );
  });
});
