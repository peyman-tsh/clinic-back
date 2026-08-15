import { DeleteBranchUseCase } from './delete-branch.use-case';
import { Branch } from '../../domain/entities/branch';
import { BranchNotFoundError } from '../../domain/errors/branch.errors';
import type { BranchRepository } from '../../domain/repositories/branch.repository';

describe('DeleteBranchUseCase', () => {
  let useCase: DeleteBranchUseCase;
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

    useCase = new DeleteBranchUseCase(mockBranchRepository);
  });

  it('deletes a branch if found', async () => {
    const branch = Branch.create({
      id: 'branch-1',
      clinicId: 'clinic-1',
      name: 'Delete Branch',
      addressLine1: 'Main St 1',
      city: 'City',
      countryCode: 'DE',
    });

    mockBranchRepository.findById.mockResolvedValue(branch);

    await useCase.execute('branch-1');

    expect(mockBranchRepository.delete).toHaveBeenCalledWith('branch-1');
  });

  it('throws BranchNotFoundError if branch does not exist', async () => {
    mockBranchRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('missing-id')).rejects.toThrow(BranchNotFoundError);
  });
});
