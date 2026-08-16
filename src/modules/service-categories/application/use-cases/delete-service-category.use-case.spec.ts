import { DeleteServiceCategoryUseCase } from './delete-service-category.use-case';
import { ServiceCategory } from '../../domain/entities/service-category';
import { ServiceCategoryNotFoundError } from '../../domain/errors/service-category.errors';
import type { ServiceCategoryRepository } from '../../domain/repositories/service-category.repository';

describe('DeleteServiceCategoryUseCase', () => {
  let useCase: DeleteServiceCategoryUseCase;
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

    useCase = new DeleteServiceCategoryUseCase(mockCategoryRepo);
  });

  it('deletes a service category if found', async () => {
    const category = ServiceCategory.create({
      id: 'cat-1',
      clinicId: 'clinic-1',
      name: 'Delete Category',
    });

    mockCategoryRepo.findById.mockResolvedValue(category);

    await useCase.execute('cat-1');

    expect(mockCategoryRepo.delete).toHaveBeenCalledWith('cat-1');
  });

  it('throws ServiceCategoryNotFoundError if category does not exist', async () => {
    mockCategoryRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute('missing-id')).rejects.toThrow(ServiceCategoryNotFoundError);
  });
});
