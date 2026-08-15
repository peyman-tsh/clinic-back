import { FindStaffUseCase } from './find-staff.use-case';
import { Staff } from '../../domain/entities/staff';
import { StaffNotFoundError } from '../../domain/errors/staff.errors';
import type { StaffRepository } from '../../domain/repositories/staff.repository';

describe('FindStaffUseCase', () => {
  let useCase: FindStaffUseCase;
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

    useCase = new FindStaffUseCase(mockStaffRepo);
  });

  it('returns a staff member if found', async () => {
    const staff = Staff.create({
      id: 'staff-1',
      userId: 'user-1',
      clinicId: 'clinic-1',
    });

    mockStaffRepo.findById.mockResolvedValue(staff);

    const result = await useCase.execute('staff-1');
    expect(result.id).toBe('staff-1');
    expect(result.userId).toBe('user-1');
  });

  it('throws StaffNotFoundError if staff member does not exist', async () => {
    mockStaffRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute('missing-id')).rejects.toThrow(StaffNotFoundError);
  });
});
