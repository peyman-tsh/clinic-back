import { FindClinicServiceCategoriesUseCase } from './find-clinic-service-categories.use-case';
import { ServiceCategory } from '../../domain/entities/service-category';
import { Clinic } from '../../../clinics/domain/entities/clinic';
import { ClinicNotFoundError } from '../../../clinics/domain/errors/clinic.errors';
import type { ServiceCategoryRepository } from '../../domain/repositories/service-category.repository';
import type { ClinicRepository } from '../../../clinics/domain/repositories/clinic.repository';

describe('FindClinicServiceCategoriesUseCase', () => {
  let useCase: FindClinicServiceCategoriesUseCase;
  let mockCategoryRepo: jest.Mocked<ServiceCategoryRepository>;
  let mockClinicsRepo: jest.Mocked<ClinicRepository>;

  const mockClinic = Clinic.create({
    id: 'clinic-uuid-1',
    name: 'Glow Beauty Clinic',
  });

  beforeEach(() => {
    mockCategoryRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByClinicIdAndSlug: jest.fn(),
      findByClinicId: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    mockClinicsRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findBySlug: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new FindClinicServiceCategoriesUseCase(
      mockCategoryRepo,
      mockClinicsRepo,
    );
  });

  it('returns all service categories belonging to a valid clinic', async () => {
    mockClinicsRepo.findById.mockResolvedValue(mockClinic);

    const c1 = ServiceCategory.create({
      id: 'cat-1',
      clinicId: 'clinic-uuid-1',
      name: 'Skin Care',
    });

    mockCategoryRepo.findByClinicId.mockResolvedValue([c1]);

    const results = await useCase.execute('clinic-uuid-1');
    expect(results).toHaveLength(1);
    expect(results[0].clinicId).toBe('clinic-uuid-1');
    expect(results[0].name).toBe('Skin Care');
  });

  it('throws ClinicNotFoundError if parent clinic does not exist', async () => {
    mockClinicsRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute('missing-clinic')).rejects.toThrow(
      ClinicNotFoundError,
    );
  });
});
