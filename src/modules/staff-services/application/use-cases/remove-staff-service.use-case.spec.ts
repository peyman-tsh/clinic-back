import { RemoveStaffServiceUseCase } from './remove-staff-service.use-case';
import { StaffServiceRepository } from '../../domain/repositories/staff-service.repository';
import { StaffService } from '../../domain/entities/staff-service';
import { StaffServiceNotFoundError } from '../../domain/errors/staff-service.errors';

describe('RemoveStaffServiceUseCase', () => {
  let useCase: RemoveStaffServiceUseCase;
  let staffServiceRepo: jest.Mocked<StaffServiceRepository>;

  const id = '11111111-1111-4111-a111-111111111111';
  const mockItem = StaffService.create({
    id,
    staffId: '22222222-2222-4222-a222-222222222222',
    serviceId: '33333333-3333-4333-a333-333333333333',
  });

  beforeEach(() => {
    staffServiceRepo = {
      save: jest.fn(),
      findById: jest.fn().mockResolvedValue(mockItem),
      findByStaffIdAndServiceId: jest.fn(),
      findByStaffId: jest.fn(),
      findByServiceId: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn().mockResolvedValue(undefined),
    };

    useCase = new RemoveStaffServiceUseCase(staffServiceRepo);
  });

  it('removes staff service assignment successfully', async () => {
    await useCase.execute(id);

    expect(staffServiceRepo.findById).toHaveBeenCalledWith(id);
    expect(staffServiceRepo.delete).toHaveBeenCalledWith(id);
  });

  it('throws StaffServiceNotFoundError when assignment does not exist', async () => {
    staffServiceRepo.findById.mockResolvedValueOnce(null);

    await expect(useCase.execute('unknown-id')).rejects.toThrow(
      StaffServiceNotFoundError,
    );
  });
});
