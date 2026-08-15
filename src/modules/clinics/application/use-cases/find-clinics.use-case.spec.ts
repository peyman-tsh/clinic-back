import { FindClinicsUseCase } from './find-clinics.use-case';
import { Clinic } from '../../domain/entities/clinic';
import type { ClinicRepository } from '../../domain/repositories/clinic.repository';

describe('FindClinicsUseCase', () => {
  let useCase: FindClinicsUseCase;
  let mockRepository: jest.Mocked<ClinicRepository>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findBySlug: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new FindClinicsUseCase(mockRepository);
  });

  it('returns a list of clinics', async () => {
    const c1 = Clinic.create({ id: '1', name: 'Clinic A' });
    const c2 = Clinic.create({ id: '2', name: 'Clinic B' });

    mockRepository.findAll.mockResolvedValue([c1, c2]);

    const results = await useCase.execute();
    expect(results).toHaveLength(2);
    expect(results[0].name).toBe('Clinic A');
    expect(results[1].name).toBe('Clinic B');
  });
});
