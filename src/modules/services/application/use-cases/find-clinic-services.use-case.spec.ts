import { FindClinicServicesUseCase } from './find-clinic-services.use-case';
import { Service } from '../../domain/entities/service';
import { Clinic } from '../../../clinics/domain/entities/clinic';
import { ClinicNotFoundError } from '../../../clinics/domain/errors/clinic.errors';
import type { ServiceRepository } from '../../domain/repositories/service.repository';
import type { ClinicRepository } from '../../../clinics/domain/repositories/clinic.repository';

describe('FindClinicServicesUseCase', () => {
  let useCase: FindClinicServicesUseCase;
  let mockServicesRepo: jest.Mocked<ServiceRepository>;
  let mockClinicsRepo: jest.Mocked<ClinicRepository>;

  const mockClinic = Clinic.create({
    id: 'clinic-uuid-1',
    name: 'Glow Beauty Clinic',
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

    useCase = new FindClinicServicesUseCase(mockServicesRepo, mockClinicsRepo);
  });

  it('returns all services belonging to a valid clinic', async () => {
    mockClinicsRepo.findById.mockResolvedValue(mockClinic);

    const s1 = Service.create({
      id: 's-1',
      clinicId: 'clinic-uuid-1',
      categoryId: 'cat-1',
      name: 'Botox',
      durationMinutes: 30,
      price: 180,
    });

    mockServicesRepo.findByClinicId.mockResolvedValue([s1]);

    const results = await useCase.execute('clinic-uuid-1');
    expect(results).toHaveLength(1);
    expect(results[0].clinicId).toBe('clinic-uuid-1');
    expect(results[0].name).toBe('Botox');
  });

  it('throws ClinicNotFoundError if parent clinic does not exist', async () => {
    mockClinicsRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute('missing-clinic')).rejects.toThrow(
      ClinicNotFoundError,
    );
  });
});
