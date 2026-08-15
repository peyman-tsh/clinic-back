import { UpdateStaffUseCase } from './update-staff.use-case';
import { Staff, StaffStatus } from '../../domain/entities/staff';
import { StaffNotFoundError } from '../../domain/errors/staff.errors';
import type { StaffRepository } from '../../domain/repositories/staff.repository';

describe('UpdateStaffUseCase', () => {
  let useCase: UpdateStaffUseCase;
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

    useCase = new UpdateStaffUseCase(mockStaffRepo);
  });

  it('updates staff member profile successfully', async () => {
    const staff = Staff.create({
      id: 'staff-uuid-1',
      userId: 'user-uuid-1',
      clinicId: 'clinic-uuid-1',
      jobTitle: 'Junior Doctor',
    });

    mockStaffRepo.findById.mockResolvedValue(staff);

    const updated = await useCase.execute('staff-uuid-1', {
      jobTitle: 'Senior Dermatologist',
      status: StaffStatus.ON_LEAVE,
    });

    expect(updated.jobTitle).toBe('Senior Dermatologist');
    expect(updated.status).toBe(StaffStatus.ON_LEAVE);
    expect(mockStaffRepo.save).toHaveBeenCalled();
  });

  it('throws StaffNotFoundError if staff profile does not exist', async () => {
    mockStaffRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute('missing-id', {
        jobTitle: 'New Title',
      }),
    ).rejects.toThrow(StaffNotFoundError);
  });
});
