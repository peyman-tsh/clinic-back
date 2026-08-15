import { FindClinicBranchesUseCase } from './find-clinic-branches.use-case';
import { Branch } from '../../domain/entities/branch';
import { Clinic } from '../../../clinics/domain/entities/clinic';
import { ClinicNotFoundError } from '../../../clinics/domain/errors/clinic.errors';
import type { BranchRepository } from '../../domain/repositories/branch.repository';
import type { ClinicRepository } from '../../../clinics/domain/repositories/clinic.repository';

describe('FindClinicBranchesUseCase', () => {
  let useCase: FindClinicBranchesUseCase;
  let mockBranchRepository: jest.Mocked<BranchRepository>;
  let mockClinicRepository: jest.Mocked<ClinicRepository>;

  const mockClinic = Clinic.create({
    id: 'clinic-uuid-1',
    name: 'Glow Beauty Clinic',
  });

  beforeEach(() => {
    mockBranchRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByClinicIdAndCode: jest.fn(),
      findByClinicId: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    mockClinicRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findBySlug: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new FindClinicBranchesUseCase(
      mockBranchRepository,
      mockClinicRepository,
    );
  });

  it('returns all branches belonging to a valid clinic', async () => {
    mockClinicRepository.findById.mockResolvedValue(mockClinic);

    const b1 = Branch.create({
      id: 'branch-1',
      clinicId: 'clinic-uuid-1',
      name: 'Frankfurt Branch',
      addressLine1: 'Main St 10',
      city: 'Frankfurt',
      countryCode: 'DE',
    });

    mockBranchRepository.findByClinicId.mockResolvedValue([b1]);

    const results = await useCase.execute('clinic-uuid-1');
    expect(results).toHaveLength(1);
    expect(results[0].clinicId).toBe('clinic-uuid-1');
    expect(results[0].name).toBe('Frankfurt Branch');
  });

  it('throws ClinicNotFoundError if parent clinic does not exist', async () => {
    mockClinicRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('missing-clinic')).rejects.toThrow(
      ClinicNotFoundError,
    );
  });
});
