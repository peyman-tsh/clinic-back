import { UpdateStaffServiceUseCase } from './update-staff-service.use-case';
import { StaffServiceRepository } from '../../domain/repositories/staff-service.repository';
import { StaffService } from '../../domain/entities/staff-service';
import { StaffServiceNotFoundError } from '../../domain/errors/staff-service.errors';

describe('UpdateStaffServiceUseCase', () => {
  let useCase: UpdateStaffServiceUseCase;
  let staffServiceRepo: jest.Mocked<StaffServiceRepository>;

  const id = '11111111-1111-4111-a111-111111111111';
  const mockStaffService = StaffService.create({
    id,
    staffId: '22222222-2222-4222-a222-222222222222',
    serviceId: '33333333-3333-4333-a333-333333333333',
    priceOverride: 200,
    durationOverrideMinutes: 45,
    depositOverride: 50,
  });

  beforeEach(() => {
    staffServiceRepo = {
      save: jest.fn().mockResolvedValue(undefined),
      findById: jest.fn().mockResolvedValue(mockStaffService),
      findByStaffIdAndServiceId: jest.fn(),
      findByStaffId: jest.fn(),
      findByServiceId: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new UpdateStaffServiceUseCase(staffServiceRepo);
  });

  it('updates staff service overrides successfully', async () => {
    const result = await useCase.execute(id, {
      priceOverride: 250,
      durationOverrideMinutes: 60,
      depositOverride: 70,
      isActive: false,
    });

    expect(result.priceOverride).toBe(250);
    expect(result.durationOverrideMinutes).toBe(60);
    expect(result.depositOverride).toBe(70);
    expect(result.isActive).toBe(false);
    expect(staffServiceRepo.save).toHaveBeenCalledTimes(1);
  });

  it('throws StaffServiceNotFoundError when entity not found', async () => {
    staffServiceRepo.findById.mockResolvedValueOnce(null);

    await expect(
      useCase.execute('unknown-id', { priceOverride: 100 }),
    ).rejects.toThrow(StaffServiceNotFoundError);
  });
});
