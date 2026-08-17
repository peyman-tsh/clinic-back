import { DeleteClinicUseCase } from './delete-clinic.use-case';
import { Clinic } from '../../domain/entities/clinic';
import { ClinicNotFoundError } from '../../domain/errors/clinic.errors';
import type { ClinicRepository } from '../../domain/repositories/clinic.repository';

describe('DeleteClinicUseCase', () => {
  let useCase: DeleteClinicUseCase;
  let mockRepository: jest.Mocked<ClinicRepository>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findBySlug: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new DeleteClinicUseCase(mockRepository);
  });

  it('deletes a clinic if found', async () => {
    const clinic = Clinic.create({ id: 'clinic-1', name: 'Delete Me' });
    mockRepository.findById.mockResolvedValue(clinic);

    await useCase.execute('clinic-1');

    expect(mockRepository.delete).toHaveBeenCalledWith('clinic-1');
  });

  it('throws ClinicNotFoundError if clinic does not exist', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('non-existent')).rejects.toThrow(
      ClinicNotFoundError,
    );
  });
});
