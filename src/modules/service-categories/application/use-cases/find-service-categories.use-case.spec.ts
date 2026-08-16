import { FindServiceCategoriesUseCase } from './find-service-categories.use-case';
import { ServiceCategory } from '../../domain/entities/service-category';
import type { ServiceCategoryRepository } from '../../domain/repositories/service-category.repository';

describe('FindServiceCategoriesUseCase', () => {
  let useCase: FindServiceCategoriesUseCase;
  let mockCategoryRepo: jest.Mocked<ServiceCategoryRepository>;

  beforeEach(() => {
    mockCategoryRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByClinicIdAndSlug: jest.fn(),
      findByClinicId: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new FindServiceCategoriesUseCase(mockCategoryRepo);
  });

  it('returns a list of all service categories', async () => {
    const c1 = ServiceCategory.create({
      id: '1',
      clinicId: 'clinic-1',
      name: 'Category A',
    });

    mockCategoryRepo.findAll.mockResolvedValue([c1]);

    const results = await useCase.execute();
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Category A');
  });
});
