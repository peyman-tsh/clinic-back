import { CreateClinicUseCase } from './create-clinic.use-case';
import { Clinic } from '../../domain/entities/clinic';
import { ClinicSlugAlreadyInUseError } from '../../domain/errors/clinic.errors';
import type { ClinicRepository } from '../../domain/repositories/clinic.repository';
import type { ClinicIdGenerator } from '../ports/clinic-id-generator';

describe('CreateClinicUseCase', () => {
  let useCase: CreateClinicUseCase;
  let mockRepository: jest.Mocked<ClinicRepository>;
  let mockIdGenerator: jest.Mocked<ClinicIdGenerator>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findBySlug: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    mockIdGenerator = {
      generate: jest.fn().mockReturnValue('clinic-uuid-1234'),
    };

    useCase = new CreateClinicUseCase(mockRepository, mockIdGenerator);
  });

  it('creates and saves a new clinic successfully', async () => {
    mockRepository.findBySlug.mockResolvedValue(null);

    const result = await useCase.execute({
      name: 'Sunrise Clinic',
    });

    expect(result.id).toBe('clinic-uuid-1234');
    expect(result.name).toBe('Sunrise Clinic');
    expect(result.slug).toBe('sunrise-clinic');
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
  });

  it('throws an error if clinic slug already exists', async () => {
    const existingClinic = Clinic.create({
      id: 'existing-id',
      name: 'Sunrise Clinic',
      slug: 'sunrise-clinic',
    });

    mockRepository.findBySlug.mockResolvedValue(existingClinic);

    await expect(
      useCase.execute({
        name: 'Sunrise Clinic',
      }),
    ).rejects.toThrow(ClinicSlugAlreadyInUseError);
  });
});
