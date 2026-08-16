import { CreateServiceCategoryUseCase } from './create-service-category.use-case';
import { ServiceCategory } from '../../domain/entities/service-category';
import { ServiceCategorySlugAlreadyInUseError } from '../../domain/errors/service-category.errors';
import type { ServiceCategoryRepository } from '../../domain/repositories/service-category.repository';
import type { ServiceCategoryIdGenerator } from '../ports/service-category-id-generator';
import type { ClinicRepository } from '../../../clinics/domain/repositories/clinic.repository';
import { Clinic } from '../../../clinics/domain/entities/clinic';
import { ClinicNotFoundError } from '../../../clinics/domain/errors/clinic.errors';

describe('CreateServiceCategoryUseCase', () => {
  let useCase: CreateServiceCategoryUseCase;
  let mockCategoryRepo: jest.Mocked<ServiceCategoryRepository>;
  let mockClinicsRepo: jest.Mocked<ClinicRepository>;
  let mockIdGenerator: jest.Mocked<ServiceCategoryIdGenerator>;

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

    mockIdGenerator = {
      generate: jest.fn().mockReturnValue('category-uuid-1'),
    };

    useCase = new CreateServiceCategoryUseCase(
      mockCategoryRepo,
      mockClinicsRepo,
      mockIdGenerator,
    );
  });

  it('creates and saves a service category if clinic exists and slug is unique', async () => {
    mockClinicsRepo.findById.mockResolvedValue(mockClinic);
    mockCategoryRepo.findByClinicIdAndSlug.mockResolvedValue(null);

    const result = await useCase.execute({
      clinicId: 'clinic-uuid-1',
      name: 'Injectables',
    });

    expect(result.id).toBe('category-uuid-1');
    expect(result.clinicId).toBe('clinic-uuid-1');
    expect(result.name).toBe('Injectables');
    expect(result.slug).toBe('injectables');
    expect(mockCategoryRepo.save).toHaveBeenCalledTimes(1);
  });

  it('throws ClinicNotFoundError if clinic does not exist', async () => {
    mockClinicsRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        clinicId: 'missing-clinic',
        name: 'Injectables',
      }),
    ).rejects.toThrow(ClinicNotFoundError);
  });

  it('throws ServiceCategorySlugAlreadyInUseError if category slug exists for the clinic', async () => {
    mockClinicsRepo.findById.mockResolvedValue(mockClinic);

    const existingCategory = ServiceCategory.create({
      id: 'existing-id',
      clinicId: 'clinic-uuid-1',
      name: 'Injectables',
    });

    mockCategoryRepo.findByClinicIdAndSlug.mockResolvedValue(existingCategory);

    await expect(
      useCase.execute({
        clinicId: 'clinic-uuid-1',
        name: 'Injectables',
      }),
    ).rejects.toThrow(ServiceCategorySlugAlreadyInUseError);
  });
});
