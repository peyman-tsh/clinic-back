import { DeleteStaffUseCase } from './delete-staff.use-case';
import { Staff } from '../../domain/entities/staff';
import { StaffNotFoundError } from '../../domain/errors/staff.errors';
import type { StaffRepository } from '../../domain/repositories/staff.repository';

describe('DeleteStaffUseCase', () => {
  let useCase: DeleteStaffUseCase;
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

    useCase = new DeleteStaffUseCase(mockStaffRepo);
  });

  it('deletes a staff profile if found', async () => {
    const staff = Staff.create({
      id: 'staff-1',
      userId: 'user-1',
      clinicId: 'clinic-1',
    });

    mockStaffRepo.findById.mockResolvedValue(staff);

    await useCase.execute('staff-1');

    expect(mockStaffRepo.delete).toHaveBeenCalledWith('staff-1');
  });

  it('throws StaffNotFoundError if staff profile does not exist', async () => {
    mockStaffRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute('missing-id')).rejects.toThrow(StaffNotFoundError);
  });
});
