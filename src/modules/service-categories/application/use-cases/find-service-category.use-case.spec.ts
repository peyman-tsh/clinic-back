import { FindServiceCategoryUseCase } from './find-service-category.use-case';
import { ServiceCategory } from '../../domain/entities/service-category';
import { ServiceCategoryNotFoundError } from '../../domain/errors/service-category.errors';
import type { ServiceCategoryRepository } from '../../domain/repositories/service-category.repository';

describe('FindServiceCategoryUseCase', () => {
  let useCase: FindServiceCategoryUseCase;
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

    useCase = new FindServiceCategoryUseCase(mockCategoryRepo);
  });

  it('returns a service category if found', async () => {
    const category = ServiceCategory.create({
      id: 'cat-1',
      clinicId: 'clinic-1',
      name: 'Laser Treatments',
    });

    mockCategoryRepo.findById.mockResolvedValue(category);

    const result = await useCase.execute('cat-1');
    expect(result.id).toBe('cat-1');
    expect(result.name).toBe('Laser Treatments');
  });

  it('throws ServiceCategoryNotFoundError if category does not exist', async () => {
    mockCategoryRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute('missing-id')).rejects.toThrow(ServiceCategoryNotFoundError);
  });
});
