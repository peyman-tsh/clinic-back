import { FindClinicUseCase } from './find-clinic.use-case';
import { Clinic } from '../../domain/entities/clinic';
import { ClinicNotFoundError } from '../../domain/errors/clinic.errors';
import type { ClinicRepository } from '../../domain/repositories/clinic.repository';

describe('FindClinicUseCase', () => {
  let useCase: FindClinicUseCase;
  let mockRepository: jest.Mocked<ClinicRepository>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findBySlug: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new FindClinicUseCase(mockRepository);
  });

  it('returns a clinic if found', async () => {
    const clinic = Clinic.create({
      id: 'clinic-uuid-1',
      name: 'City Clinic',
    });

    mockRepository.findById.mockResolvedValue(clinic);

    const result = await useCase.execute('clinic-uuid-1');
    expect(result.id).toBe('clinic-uuid-1');
    expect(result.name).toBe('City Clinic');
  });

  it('throws ClinicNotFoundError if clinic does not exist', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('missing-id')).rejects.toThrow(ClinicNotFoundError);
  });
});
