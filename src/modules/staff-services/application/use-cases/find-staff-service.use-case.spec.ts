import { FindStaffServiceUseCase } from './find-staff-service.use-case';
import { StaffServiceRepository } from '../../domain/repositories/staff-service.repository';
import { StaffService } from '../../domain/entities/staff-service';
import { StaffServiceNotFoundError } from '../../domain/errors/staff-service.errors';

describe('FindStaffServiceUseCase', () => {
  let useCase: FindStaffServiceUseCase;
  let staffServiceRepo: jest.Mocked<StaffServiceRepository>;

  const id = '11111111-1111-4111-a111-111111111111';
  const mockStaffService = StaffService.create({
    id,
    staffId: '22222222-2222-4222-a222-222222222222',
    serviceId: '33333333-3333-4333-a333-333333333333',
    priceOverride: 200,
  });

  beforeEach(() => {
    staffServiceRepo = {
      save: jest.fn(),
      findById: jest.fn().mockResolvedValue(mockStaffService),
      findByStaffIdAndServiceId: jest.fn(),
      findByStaffId: jest.fn(),
      findByServiceId: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new FindStaffServiceUseCase(staffServiceRepo);
  });

  it('finds and returns staff service by id', async () => {
    const result = await useCase.execute(id);

    expect(result.id).toBe(id);
    expect(result.priceOverride).toBe(200);
  });

  it('throws StaffServiceNotFoundError when not found', async () => {
    staffServiceRepo.findById.mockResolvedValueOnce(null);

    await expect(useCase.execute('unknown-id')).rejects.toThrow(
      StaffServiceNotFoundError,
    );
  });
});
