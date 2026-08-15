import { RemoveStaffFromBranchUseCase } from './remove-staff-from-branch.use-case';
import { Staff } from '../../domain/entities/staff';
import { StaffNotFoundError } from '../../domain/errors/staff.errors';
import type { StaffRepository } from '../../domain/repositories/staff.repository';

describe('RemoveStaffFromBranchUseCase', () => {
  let useCase: RemoveStaffFromBranchUseCase;
  let mockStaffRepo: jest.Mocked<StaffRepository>;

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

    useCase = new RemoveStaffFromBranchUseCase(mockStaffRepo);
  });

  it('unassigns staff from a branch successfully', async () => {
    const staff = Staff.create({
      id: 'staff-uuid-1',
      userId: 'user-uuid-1',
      clinicId: 'clinic-uuid-1',
    });

    staff.assignBranch({
      id: 'assign-1',
      staffId: 'staff-uuid-1',
      branchId: 'branch-uuid-1',
      isPrimary: true,
      createdAt: new Date(),
    });

    mockStaffRepo.findById.mockResolvedValue(staff);

    const result = await useCase.execute('staff-uuid-1', 'branch-uuid-1');
    expect(result.branches).toHaveLength(0);
    expect(mockStaffRepo.removeBranch).toHaveBeenCalledWith('staff-uuid-1', 'branch-uuid-1');
  });

  it('throws StaffNotFoundError if staff member does not exist', async () => {
    mockStaffRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute('missing-staff', 'branch-1')).rejects.toThrow(
      StaffNotFoundError,
    );
  });
});
