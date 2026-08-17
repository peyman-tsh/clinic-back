import { CreateBranchUseCase } from './create-branch.use-case';
import { Branch } from '../../domain/entities/branch';
import { BranchCodeAlreadyInUseError } from '../../domain/errors/branch.errors';
import type { BranchRepository } from '../../domain/repositories/branch.repository';
import type { BranchIdGenerator } from '../ports/branch-id-generator';
import type { ClinicRepository } from '../../../clinics/domain/repositories/clinic.repository';
import { Clinic } from '../../../clinics/domain/entities/clinic';
import { ClinicNotFoundError } from '../../../clinics/domain/errors/clinic.errors';

describe('CreateBranchUseCase', () => {
  let useCase: CreateBranchUseCase;
  let mockBranchRepository: jest.Mocked<BranchRepository>;
  let mockClinicRepository: jest.Mocked<ClinicRepository>;
  let mockIdGenerator: jest.Mocked<BranchIdGenerator>;

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

    mockIdGenerator = {
      generate: jest.fn().mockReturnValue('branch-uuid-1'),
    };

    useCase = new CreateBranchUseCase(
      mockBranchRepository,
      mockClinicRepository,
      mockIdGenerator,
    );
  });

  it('creates and saves a branch if clinic exists and code is unique', async () => {
    mockClinicRepository.findById.mockResolvedValue(mockClinic);
    mockBranchRepository.findByClinicIdAndCode.mockResolvedValue(null);

    const result = await useCase.execute({
      clinicId: 'clinic-uuid-1',
      name: 'Frankfurt Branch',
      code: 'FRA-01',
      addressLine1: 'Main St 10',
      city: 'Frankfurt',
      countryCode: 'DE',
    });

    expect(result.id).toBe('branch-uuid-1');
    expect(result.clinicId).toBe('clinic-uuid-1');
    expect(result.name).toBe('Frankfurt Branch');
    expect(result.code).toBe('FRA-01');
    expect(mockBranchRepository.save).toHaveBeenCalledTimes(1);
  });

  it('throws ClinicNotFoundError if parent clinic does not exist', async () => {
    mockClinicRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        clinicId: 'missing-clinic',
        name: 'Frankfurt Branch',
        addressLine1: 'Main St 10',
        city: 'Frankfurt',
        countryCode: 'DE',
      }),
    ).rejects.toThrow(ClinicNotFoundError);
  });

  it('throws BranchCodeAlreadyInUseError if branch code is duplicated for the clinic', async () => {
    mockClinicRepository.findById.mockResolvedValue(mockClinic);

    const existingBranch = Branch.create({
      id: 'existing-branch-id',
      clinicId: 'clinic-uuid-1',
      name: 'Existing Branch',
      code: 'FRA-01',
      addressLine1: 'Other St',
      city: 'Frankfurt',
      countryCode: 'DE',
    });

    mockBranchRepository.findByClinicIdAndCode.mockResolvedValue(
      existingBranch,
    );

    await expect(
      useCase.execute({
        clinicId: 'clinic-uuid-1',
        name: 'Frankfurt Branch',
        code: 'FRA-01',
        addressLine1: 'Main St 10',
        city: 'Frankfurt',
        countryCode: 'DE',
      }),
    ).rejects.toThrow(BranchCodeAlreadyInUseError);
  });
});
