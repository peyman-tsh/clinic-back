import { FindBranchesUseCase } from './find-branches.use-case';
import { Branch } from '../../domain/entities/branch';
import type { BranchRepository } from '../../domain/repositories/branch.repository';

describe('FindBranchesUseCase', () => {
  let useCase: FindBranchesUseCase;
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

    useCase = new FindBranchesUseCase(mockBranchRepository);
  });

  it('returns a list of branches', async () => {
    const b1 = Branch.create({
      id: '1',
      clinicId: 'c1',
      name: 'Branch A',
      addressLine1: 'Addr 1',
      city: 'City A',
      countryCode: 'DE',
    });

    mockBranchRepository.findAll.mockResolvedValue([b1]);

    const results = await useCase.execute();
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Branch A');
  });
});
