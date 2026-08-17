import { FindBranchUseCase } from './find-branch.use-case';
import { Branch } from '../../domain/entities/branch';
import { BranchNotFoundError } from '../../domain/errors/branch.errors';
import type { BranchRepository } from '../../domain/repositories/branch.repository';

describe('FindBranchUseCase', () => {
  let useCase: FindBranchUseCase;
  let mockBranchRepository: jest.Mocked<BranchRepository>;

  beforeEach(() => {
    mockBranchRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByClinicIdAndCode: jest.fn(),
      findByClinicId: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new FindBranchUseCase(mockBranchRepository);
  });

  it('returns a branch if found', async () => {
    const branch = Branch.create({
      id: 'branch-1',
      clinicId: 'clinic-1',
      name: 'Hamburg Branch',
      addressLine1: 'Mönckebergstraße 5',
      city: 'Hamburg',
      countryCode: 'DE',
    });

    mockBranchRepository.findById.mockResolvedValue(branch);

    const result = await useCase.execute('branch-1');
    expect(result.id).toBe('branch-1');
    expect(result.name).toBe('Hamburg Branch');
  });

  it('throws BranchNotFoundError if branch does not exist', async () => {
    mockBranchRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('missing-id')).rejects.toThrow(
      BranchNotFoundError,
    );
  });
});
