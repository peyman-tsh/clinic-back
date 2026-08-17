import { AssignStaffServiceUseCase } from './assign-staff-service.use-case';
import { StaffServiceRepository } from '../../domain/repositories/staff-service.repository';
import { StaffRepository } from '../../../staff/domain/repositories/staff.repository';
import { ServiceRepository } from '../../../services/domain/repositories/service.repository';
import { StaffServiceIdGenerator } from '../ports/staff-service-id-generator';
import { Staff } from '../../../staff/domain/entities/staff';
import { Service } from '../../../services/domain/entities/service';
import {
  StaffServiceAlreadyExistsError,
  StaffServiceClinicMismatchError,
} from '../../domain/errors/staff-service.errors';
import { StaffNotFoundError } from '../../../staff/domain/errors/staff.errors';
import { ServiceNotFoundError } from '../../../services/domain/errors/service.errors';
import { StaffService } from '../../domain/entities/staff-service';

describe('AssignStaffServiceUseCase', () => {
  let useCase: AssignStaffServiceUseCase;
  let staffServiceRepo: jest.Mocked<StaffServiceRepository>;
  let staffRepo: jest.Mocked<StaffRepository>;
  let serviceRepo: jest.Mocked<ServiceRepository>;
  let idGenerator: jest.Mocked<StaffServiceIdGenerator>;

  const staffId = '11111111-1111-4111-a111-111111111111';
  const serviceId = '22222222-2222-4222-a222-222222222222';
  const clinicId = '33333333-3333-4333-a333-333333333333';
  const generatedId = '44444444-4444-4444-a444-444444444444';

  const mockStaff = Staff.create({
    id: staffId,
    userId: '55555555-5555-4555-a555-555555555555',
    clinicId,
    jobTitle: 'Doctor',
  });

  const mockService = Service.create({
    id: serviceId,
    clinicId,
    categoryId: '66666666-6666-4666-a666-666666666666',
    name: 'Botox',
    price: 180,
    durationMinutes: 30,
  });

  beforeEach(() => {
    staffServiceRepo = {
      save: jest.fn().mockResolvedValue(undefined),
      findById: jest.fn(),
      findByStaffIdAndServiceId: jest.fn().mockResolvedValue(null),
      findByStaffId: jest.fn(),
      findByServiceId: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    staffRepo = {
      save: jest.fn(),
      findById: jest.fn().mockResolvedValue(mockStaff),
      findByUserId: jest.fn(),
      findByClinicId: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    serviceRepo = {
      save: jest.fn(),
      findById: jest.fn().mockResolvedValue(mockService),
      findByClinicIdAndSlug: jest.fn(),
      findByClinicId: jest.fn(),
      findByCategoryId: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    idGenerator = {
      generate: jest.fn().mockReturnValue(generatedId),
    };

    useCase = new AssignStaffServiceUseCase(
      staffServiceRepo,
      staffRepo,
      serviceRepo,
      idGenerator,
    );
  });

  it('assigns service to staff successfully with overrides', async () => {
    const result = await useCase.execute({
      staffId,
      serviceId,
      priceOverride: 200,
      durationOverrideMinutes: 45,
      depositOverride: 50,
      isActive: true,
    });

    expect(result.id).toBe(generatedId);
    expect(result.staffId).toBe(staffId);
    expect(result.serviceId).toBe(serviceId);
    expect(result.priceOverride).toBe(200);
    expect(result.durationOverrideMinutes).toBe(45);
    expect(result.depositOverride).toBe(50);
    expect(result.isActive).toBe(true);
    expect(staffServiceRepo.save).toHaveBeenCalledTimes(1);
  });

  it('throws StaffNotFoundError when staff does not exist', async () => {
    staffRepo.findById.mockResolvedValueOnce(null);

    await expect(
      useCase.execute({
        staffId: 'non-existent-staff',
        serviceId,
      }),
    ).rejects.toThrow(StaffNotFoundError);
  });

  it('throws ServiceNotFoundError when service does not exist', async () => {
    serviceRepo.findById.mockResolvedValueOnce(null);

    await expect(
      useCase.execute({
        staffId,
        serviceId: 'non-existent-service',
      }),
    ).rejects.toThrow(ServiceNotFoundError);
  });

  it('throws StaffServiceClinicMismatchError when clinics do not match', async () => {
    const foreignService = Service.create({
      id: serviceId,
      clinicId: '77777777-7777-4777-a777-777777777777', // different clinic
      categoryId: '66666666-6666-4666-a666-666666666666',
      name: 'Botox',
      price: 180,
      durationMinutes: 30,
    });
    serviceRepo.findById.mockResolvedValueOnce(foreignService);

    await expect(
      useCase.execute({
        staffId,
        serviceId,
      }),
    ).rejects.toThrow(StaffServiceClinicMismatchError);
  });

  it('throws StaffServiceAlreadyExistsError when assignment already exists', async () => {
    const existing = StaffService.create({
      id: 'existing-id',
      staffId,
      serviceId,
    });
    staffServiceRepo.findByStaffIdAndServiceId.mockResolvedValueOnce(existing);

    await expect(
      useCase.execute({
        staffId,
        serviceId,
      }),
    ).rejects.toThrow(StaffServiceAlreadyExistsError);
  });
});
