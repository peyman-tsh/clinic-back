import { CreateServiceUseCase } from './create-service.use-case';
import { Service } from '../../domain/entities/service';
import { CategoryDoesNotBelongToClinicError, ServiceSlugAlreadyInUseError } from '../../domain/errors/service.errors';
import type { ServiceRepository } from '../../domain/repositories/service.repository';
import type { ServiceIdGenerator } from '../ports/service-id-generator';
import type { ClinicRepository } from '../../../clinics/domain/repositories/clinic.repository';
import type { ServiceCategoryRepository } from '../../../service-categories/domain/repositories/service-category.repository';
import { Clinic } from '../../../clinics/domain/entities/clinic';
import { ServiceCategory } from '../../../service-categories/domain/entities/service-category';
import { ClinicNotFoundError } from '../../../clinics/domain/errors/clinic.errors';
import { ServiceCategoryNotFoundError } from '../../../service-categories/domain/errors/service-category.errors';

describe('CreateServiceUseCase', () => {
  let useCase: CreateServiceUseCase;
  let mockServicesRepo: jest.Mocked<ServiceRepository>;
  let mockClinicsRepo: jest.Mocked<ClinicRepository>;
  let mockCategoriesRepo: jest.Mocked<ServiceCategoryRepository>;
  let mockIdGenerator: jest.Mocked<ServiceIdGenerator>;

  const mockClinic = Clinic.create({
    id: 'clinic-uuid-1',
    name: 'Glow Beauty Clinic',
  });

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

    mockClinicsRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findBySlug: jest.fn(),
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

    mockIdGenerator = {
      generate: jest.fn().mockReturnValue('service-uuid-1'),
    };

    useCase = new CreateServiceUseCase(
      mockServicesRepo,
      mockClinicsRepo,
      mockCategoriesRepo,
      mockIdGenerator,
    );
  });

  it('creates and saves a service if clinic and category exist and belong together', async () => {
    mockClinicsRepo.findById.mockResolvedValue(mockClinic);
    mockCategoriesRepo.findById.mockResolvedValue(mockCategory);
    mockServicesRepo.findByClinicIdAndSlug.mockResolvedValue(null);

    const result = await useCase.execute({
      clinicId: 'clinic-uuid-1',
      categoryId: 'category-uuid-1',
      name: 'Botox Treatment',
      durationMinutes: 30,
      bufferBeforeMinutes: 5,
      bufferAfterMinutes: 10,
      price: 180,
    });

    expect(result.id).toBe('service-uuid-1');
    expect(result.name).toBe('Botox Treatment');
    expect(result.slug).toBe('botox-treatment');
    expect(result.totalOccupiedMinutes).toBe(45);
    expect(mockServicesRepo.save).toHaveBeenCalledTimes(1);
  });

  it('throws ClinicNotFoundError if clinic does not exist', async () => {
    mockClinicsRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        clinicId: 'missing-clinic',
        categoryId: 'category-uuid-1',
        name: 'Botox',
        durationMinutes: 30,
        price: 100,
      }),
    ).rejects.toThrow(ClinicNotFoundError);
  });

  it('throws ServiceCategoryNotFoundError if category does not exist', async () => {
    mockClinicsRepo.findById.mockResolvedValue(mockClinic);
    mockCategoriesRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        clinicId: 'clinic-uuid-1',
        categoryId: 'missing-category',
        name: 'Botox',
        durationMinutes: 30,
        price: 100,
      }),
    ).rejects.toThrow(ServiceCategoryNotFoundError);
  });

  it('throws CategoryDoesNotBelongToClinicError if category belongs to another clinic', async () => {
    mockClinicsRepo.findById.mockResolvedValue(mockClinic);

    const otherCategory = ServiceCategory.create({
      id: 'other-cat-id',
      clinicId: 'other-clinic-id',
      name: 'Injectables',
    });
    mockCategoriesRepo.findById.mockResolvedValue(otherCategory);

    await expect(
      useCase.execute({
        clinicId: 'clinic-uuid-1',
        categoryId: 'other-cat-id',
        name: 'Botox',
        durationMinutes: 30,
        price: 100,
      }),
    ).rejects.toThrow(CategoryDoesNotBelongToClinicError);
  });

  it('throws ServiceSlugAlreadyInUseError if service slug exists for the clinic', async () => {
    mockClinicsRepo.findById.mockResolvedValue(mockClinic);
    mockCategoriesRepo.findById.mockResolvedValue(mockCategory);

    const existingService = Service.create({
      id: 'existing-id',
      clinicId: 'clinic-uuid-1',
      categoryId: 'category-uuid-1',
      name: 'Botox Treatment',
      durationMinutes: 30,
      price: 180,
    });

    mockServicesRepo.findByClinicIdAndSlug.mockResolvedValue(existingService);

    await expect(
      useCase.execute({
        clinicId: 'clinic-uuid-1',
        categoryId: 'category-uuid-1',
        name: 'Botox Treatment',
        durationMinutes: 30,
        price: 180,
      }),
    ).rejects.toThrow(ServiceSlugAlreadyInUseError);
  });
});
