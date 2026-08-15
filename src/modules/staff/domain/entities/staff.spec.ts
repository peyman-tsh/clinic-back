import { Staff, StaffStatus } from './staff';
import { InvalidStaffError } from '../errors/staff.errors';

describe('Staff Entity', () => {
  const validBaseInput = {
    id: 'staff-uuid-1',
    userId: 'user-uuid-1',
    clinicId: 'clinic-uuid-1',
    jobTitle: 'Dermatologist',
    color: '#FF5733',
  };

  it('creates a valid staff entity with default values', () => {
    const staff = Staff.create(validBaseInput);

    expect(staff.id).toBe('staff-uuid-1');
    expect(staff.userId).toBe('user-uuid-1');
    expect(staff.clinicId).toBe('clinic-uuid-1');
    expect(staff.jobTitle).toBe('Dermatologist');
    expect(staff.color).toBe('#FF5733');
    expect(staff.status).toBe(StaffStatus.ACTIVE);
    expect(staff.createdAt).toBeInstanceOf(Date);
    expect(staff.branches).toHaveLength(0);
  });

  it('validates color format', () => {
    expect(() =>
      Staff.create({
        ...validBaseInput,
        color: 'invalid-color',
      }),
    ).toThrow(InvalidStaffError);
  });

  it('manages primary and secondary branch assignments', () => {
    const staff = Staff.create(validBaseInput);

    staff.assignBranch({
      id: 'assignment-1',
      staffId: 'staff-uuid-1',
      branchId: 'branch-uuid-1',
      isPrimary: true,
      createdAt: new Date(),
    });

    expect(staff.branches).toHaveLength(1);
    expect(staff.primaryBranch?.branchId).toBe('branch-uuid-1');

    staff.assignBranch({
      id: 'assignment-2',
      staffId: 'staff-uuid-1',
      branchId: 'branch-uuid-2',
      isPrimary: true,
      createdAt: new Date(),
    });

    expect(staff.branches).toHaveLength(2);
    expect(staff.primaryBranch?.branchId).toBe('branch-uuid-2');
    expect(staff.branches.find((b) => b.branchId === 'branch-uuid-1')?.isPrimary).toBe(false);
  });

  it('removes assigned branch', () => {
    const staff = Staff.create(validBaseInput);

    staff.assignBranch({
      id: 'assignment-1',
      staffId: 'staff-uuid-1',
      branchId: 'branch-uuid-1',
      isPrimary: true,
      createdAt: new Date(),
    });

    expect(staff.branches).toHaveLength(1);
    staff.removeBranch('branch-uuid-1');
    expect(staff.branches).toHaveLength(0);
  });
});
