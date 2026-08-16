import { UpdateServiceCategoryUseCase } from './update-service-category.use-case';
import { ServiceCategory } from '../../domain/entities/service-category';
import { ServiceCategoryNotFoundError } from '../../domain/errors/service-category.errors';
import type { ServiceCategoryRepository } from '../../domain/repositories/service-category.repository';

describe('UpdateServiceCategoryUseCase', () => {
  let useCase: UpdateServiceCategoryUseCase;
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

    useCase = new UpdateServiceCategoryUseCase(mockCategoryRepo);
  });

  it('updates an existing service category successfully', async () => {
    const category = ServiceCategory.create({
      id: 'category-uuid-1',
      clinicId: 'clinic-uuid-1',
      name: 'Injectables',
    });

    mockCategoryRepo.findById.mockResolvedValue(category);
    mockCategoryRepo.findByClinicIdAndSlug.mockResolvedValue(null);

    const updated = await useCase.execute('category-uuid-1', {
      name: 'Facial Injectables',
      sortOrder: 2,
    });

    expect(updated.name).toBe('Facial Injectables');
    expect(updated.slug).toBe('facial-injectables');
    expect(updated.sortOrder).toBe(2);
    expect(mockCategoryRepo.save).toHaveBeenCalled();
  });

  it('throws ServiceCategoryNotFoundError if category does not exist', async () => {
    mockCategoryRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute('missing-id', {
        name: 'New Name',
      }),
    ).rejects.toThrow(ServiceCategoryNotFoundError);
  });
});
