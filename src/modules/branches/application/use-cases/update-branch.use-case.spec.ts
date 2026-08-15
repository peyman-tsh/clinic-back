import { UpdateBranchUseCase } from './update-branch.use-case';
import { Branch, BranchStatus } from '../../domain/entities/branch';
import { BranchNotFoundError } from '../../domain/errors/branch.errors';
import type { BranchRepository } from '../../domain/repositories/branch.repository';

describe('UpdateBranchUseCase', () => {
  let useCase: UpdateBranchUseCase;
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

    useCase = new UpdateBranchUseCase(mockBranchRepository);
  });

  it('updates an existing branch successfully', async () => {
    const branch = Branch.create({
      id: 'branch-uuid-1',
      clinicId: 'clinic-uuid-1',
      name: 'Berlin Branch',
      addressLine1: 'Alexanderplatz 1',
      city: 'Berlin',
      countryCode: 'DE',
    });

    mockBranchRepository.findById.mockResolvedValue(branch);

    const updated = await useCase.execute('branch-uuid-1', {
      name: 'Berlin Central Branch',
      status: BranchStatus.INACTIVE,
    });

    expect(updated.name).toBe('Berlin Central Branch');
    expect(updated.status).toBe(BranchStatus.INACTIVE);
    expect(mockBranchRepository.save).toHaveBeenCalled();
  });

  it('throws BranchNotFoundError if branch does not exist', async () => {
    mockBranchRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute('missing-id', {
        name: 'New Name',
      }),
    ).rejects.toThrow(BranchNotFoundError);
  });
});
