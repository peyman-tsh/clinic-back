import { UpdateClinicUseCase } from './update-clinic.use-case';
import { Clinic, ClinicStatus } from '../../domain/entities/clinic';
import { ClinicNotFoundError } from '../../domain/errors/clinic.errors';
import type { ClinicRepository } from '../../domain/repositories/clinic.repository';

describe('UpdateClinicUseCase', () => {
  let useCase: UpdateClinicUseCase;
  let mockRepository: jest.Mocked<ClinicRepository>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findBySlug: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new UpdateClinicUseCase(mockRepository);
  });

  it('updates an existing clinic successfully', async () => {
    const existingClinic = Clinic.create({
      id: 'clinic-uuid-1',
      name: 'Old Name',
    });

    mockRepository.findById.mockResolvedValue(existingClinic);

    const updated = await useCase.execute('clinic-uuid-1', {
      name: 'Updated Name',
      status: ClinicStatus.Inactive,
    });

    expect(updated.name).toBe('Updated Name');
    expect(updated.status).toBe(ClinicStatus.Inactive);
    expect(mockRepository.save).toHaveBeenCalled();
  });

  it('throws ClinicNotFoundError if clinic does not exist', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute('non-existent-id', {
        name: 'New Name',
      }),
    ).rejects.toThrow(ClinicNotFoundError);
  });
});
