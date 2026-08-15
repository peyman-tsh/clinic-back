import { CreateStaffUseCase } from './create-staff.use-case';
import { Staff } from '../../domain/entities/staff';
import { UserAlreadyHasStaffProfileError } from '../../domain/errors/staff.errors';
import type { StaffRepository } from '../../domain/repositories/staff.repository';
import type { StaffIdGenerator } from '../ports/staff-id-generator';
import type { UserRepository } from '../../../users/domain/repositories/user.repository';
import type { ClinicRepository } from '../../../clinics/domain/repositories/clinic.repository';
import { User } from '../../../users/domain/entities/user';
import { Clinic } from '../../../clinics/domain/entities/clinic';
import { UserNotFoundError } from '../../../users/domain/errors/user.errors';

describe('CreateStaffUseCase', () => {
  let useCase: CreateStaffUseCase;
  let mockStaffRepo: jest.Mocked<StaffRepository>;
  let mockUsersRepo: jest.Mocked<UserRepository>;
  let mockClinicsRepo: jest.Mocked<ClinicRepository>;
  let mockIdGenerator: jest.Mocked<StaffIdGenerator>;

  const mockUser = User.rehydrate({
    id: 'user-uuid-1',
    username: 'dr_smith',
    employeeCode: 'EMP-001',
    firstName: 'John',
    lastName: 'Smith',
    email: 'smith@example.com',
    phone: null,
    avatar: null,
    passwordHash: 'hashed',
    status: 'active' as any,
    departmentId: null,
    managerId: null,
    timezone: 'UTC',
    language: 'en',
    lastLoginAt: null,
    passwordChangedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  });

  const mockClinic = Clinic.create({
    id: 'clinic-uuid-1',
    name: 'Glow Beauty Clinic',
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

    mockUsersRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByPhone: jest.fn(),
      findByUsername: jest.fn(),
      findByEmployeeCode: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    mockClinicsRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findBySlug: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    mockIdGenerator = {
      generate: jest.fn().mockReturnValue('staff-uuid-1'),
    };

    useCase = new CreateStaffUseCase(
      mockStaffRepo,
      mockUsersRepo,
      mockClinicsRepo,
      mockIdGenerator,
    );
  });

  it('creates and saves staff profile if user and clinic exist', async () => {
    mockUsersRepo.findById.mockResolvedValue(mockUser);
    mockClinicsRepo.findById.mockResolvedValue(mockClinic);
    mockStaffRepo.findByUserId.mockResolvedValue(null);

    const result = await useCase.execute({
      userId: 'user-uuid-1',
      clinicId: 'clinic-uuid-1',
      jobTitle: 'Dermatologist',
    });

    expect(result.id).toBe('staff-uuid-1');
    expect(result.userId).toBe('user-uuid-1');
    expect(result.clinicId).toBe('clinic-uuid-1');
    expect(result.jobTitle).toBe('Dermatologist');
    expect(mockStaffRepo.save).toHaveBeenCalledTimes(1);
  });

  it('throws UserNotFoundError if user does not exist', async () => {
    mockUsersRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        userId: 'missing-user',
        clinicId: 'clinic-uuid-1',
      }),
    ).rejects.toThrow(UserNotFoundError);
  });

  it('throws UserAlreadyHasStaffProfileError if staff profile already exists for user', async () => {
    mockUsersRepo.findById.mockResolvedValue(mockUser);
    mockClinicsRepo.findById.mockResolvedValue(mockClinic);

    const existingStaff = Staff.create({
      id: 'existing-staff-id',
      userId: 'user-uuid-1',
      clinicId: 'clinic-uuid-1',
    });

    mockStaffRepo.findByUserId.mockResolvedValue(existingStaff);

    await expect(
      useCase.execute({
        userId: 'user-uuid-1',
        clinicId: 'clinic-uuid-1',
      }),
    ).rejects.toThrow(UserAlreadyHasStaffProfileError);
  });
});
