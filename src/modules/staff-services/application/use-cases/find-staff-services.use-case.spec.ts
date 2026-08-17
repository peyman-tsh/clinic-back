import { FindStaffServicesUseCase } from './find-staff-services.use-case';
import { StaffServiceRepository } from '../../domain/repositories/staff-service.repository';
import { StaffService } from '../../domain/entities/staff-service';

describe('FindStaffServicesUseCase', () => {
  let useCase: FindStaffServicesUseCase;
  let staffServiceRepo: jest.Mocked<StaffServiceRepository>;

  const mockItem = StaffService.create({
    id: '11111111-1111-4111-a111-111111111111',
    staffId: '22222222-2222-4222-a222-222222222222',
    serviceId: '33333333-3333-4333-a333-333333333333',
    priceOverride: 200,
  });

  beforeEach(() => {
    staffServiceRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByStaffIdAndServiceId: jest.fn(),
      findByStaffId: jest.fn(),
      findByServiceId: jest.fn(),
      findAll: jest.fn().mockResolvedValue([mockItem]),
      delete: jest.fn(),
    };

    useCase = new FindStaffServicesUseCase(staffServiceRepo);
  });

  it('retrieves all staff services with filter', async () => {
    const result = await useCase.execute({
      staffId: '22222222-2222-4222-a222-222222222222',
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(mockItem.id);
    expect(staffServiceRepo.findAll).toHaveBeenCalledWith({
      staffId: '22222222-2222-4222-a222-222222222222',
    });
  });
});
