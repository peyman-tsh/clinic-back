import { AssignStaffToBranchUseCase } from './assign-staff-to-branch.use-case';
import { Staff } from '../../domain/entities/staff';
import { StaffNotFoundError } from '../../domain/errors/staff.errors';
import { Branch } from '../../../branches/domain/entities/branch';
import { BranchNotFoundError } from '../../../branches/domain/errors/branch.errors';
import type { StaffRepository } from '../../domain/repositories/staff.repository';
import type { BranchRepository } from '../../../branches/domain/repositories/branch.repository';
import type { StaffIdGenerator } from '../ports/staff-id-generator';

describe('AssignStaffToBranchUseCase', () => {
  let useCase: AssignStaffToBranchUseCase;
  let mockStaffRepo: jest.Mocked<StaffRepository>;
  let mockBranchesRepo: jest.Mocked<BranchRepository>;
  let mockIdGenerator: jest.Mocked<StaffIdGenerator>;

  const mockBranch = Branch.create({
    id: 'branch-uuid-1',
    clinicId: 'clinic-uuid-1',
    name: 'Frankfurt Branch',
    addressLine1: 'Main St',
    city: 'Frankfurt',
    countryCode: 'DE',
  });

  beforeEach(() => {
    mockStaffRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findByClinicId: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
      assignBranch: jest.fn(),
      removeBranch: jest.fn(),
    };

    mockBranchesRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByClinicIdAndCode: jest.fn(),
      findByClinicId: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    mockIdGenerator = {
      generate: jest.fn().mockReturnValue('assignment-uuid-1'),
    };

    useCase = new AssignStaffToBranchUseCase(
      mockStaffRepo,
      mockBranchesRepo,
      mockIdGenerator,
    );
  });

  it('assigns staff to a branch successfully', async () => {
    const staff = Staff.create({
      id: 'staff-uuid-1',
      userId: 'user-uuid-1',
      clinicId: 'clinic-uuid-1',
    });

    mockStaffRepo.findById.mockResolvedValue(staff);
    mockBranchesRepo.findById.mockResolvedValue(mockBranch);

    const result = await useCase.execute({
      staffId: 'staff-uuid-1',
      branchId: 'branch-uuid-1',
      isPrimary: true,
    });

    expect(result.branches).toHaveLength(1);
    expect(result.branches[0].branchId).toBe('branch-uuid-1');
    expect(result.branches[0].isPrimary).toBe(true);
    expect(mockStaffRepo.assignBranch).toHaveBeenCalled();
  });

  it('throws StaffNotFoundError if staff does not exist', async () => {
    mockStaffRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        staffId: 'missing-staff',
        branchId: 'branch-uuid-1',
      }),
    ).rejects.toThrow(StaffNotFoundError);
  });

  it('throws BranchNotFoundError if branch does not exist', async () => {
    const staff = Staff.create({
      id: 'staff-uuid-1',
      userId: 'user-uuid-1',
      clinicId: 'clinic-uuid-1',
    });
    mockStaffRepo.findById.mockResolvedValue(staff);
    mockBranchesRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        staffId: 'staff-uuid-1',
        branchId: 'missing-branch',
      }),
    ).rejects.toThrow(BranchNotFoundError);
  });
});
