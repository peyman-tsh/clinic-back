import { FindStaffMembersUseCase } from './find-staff-members.use-case';
import { Staff } from '../../domain/entities/staff';
import { Clinic } from '../../../clinics/domain/entities/clinic';
import { ClinicNotFoundError } from '../../../clinics/domain/errors/clinic.errors';
import type { StaffRepository } from '../../domain/repositories/staff.repository';
import type { ClinicRepository } from '../../../clinics/domain/repositories/clinic.repository';

describe('FindStaffMembersUseCase', () => {
  let useCase: FindStaffMembersUseCase;
  let mockStaffRepo: jest.Mocked<StaffRepository>;
  let mockClinicsRepo: jest.Mocked<ClinicRepository>;

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

    mockClinicsRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findBySlug: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new FindStaffMembersUseCase(mockStaffRepo, mockClinicsRepo);
  });

  it('returns all staff members when no clinic ID filter is passed', async () => {
    const s1 = Staff.create({ id: '1', userId: 'u1', clinicId: 'c1' });
    mockStaffRepo.findAll.mockResolvedValue([s1]);

    const results = await useCase.execute();
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('1');
  });

  it('returns staff members filtered by clinic ID', async () => {
    mockClinicsRepo.findById.mockResolvedValue(mockClinic);
    const s1 = Staff.create({ id: '1', userId: 'u1', clinicId: 'clinic-uuid-1' });

    mockStaffRepo.findByClinicId.mockResolvedValue([s1]);

    const results = await useCase.execute('clinic-uuid-1');
    expect(results).toHaveLength(1);
    expect(results[0].clinicId).toBe('clinic-uuid-1');
  });

  it('throws ClinicNotFoundError if clinic filter ID does not exist', async () => {
    mockClinicsRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute('missing-clinic')).rejects.toThrow(
      ClinicNotFoundError,
    );
  });
});
