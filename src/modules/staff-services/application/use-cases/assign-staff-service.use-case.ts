import { Inject, Injectable } from '@nestjs/common';
import {
  STAFF_SERVICE_REPOSITORY,
  type StaffServiceRepository,
} from '../../domain/repositories/staff-service.repository';
import {
  STAFF_REPOSITORY,
  type StaffRepository,
} from '../../../staff/domain/repositories/staff.repository';
import {
  SERVICE_REPOSITORY,
  type ServiceRepository,
} from '../../../services/domain/repositories/service.repository';
import {
  STAFF_SERVICE_ID_GENERATOR,
  type StaffServiceIdGenerator,
} from '../ports/staff-service-id-generator';
import { StaffService } from '../../domain/entities/staff-service';
import {
  StaffServiceAlreadyExistsError,
  StaffServiceClinicMismatchError,
} from '../../domain/errors/staff-service.errors';
import { StaffNotFoundError } from '../../../staff/domain/errors/staff.errors';
import { ServiceNotFoundError } from '../../../services/domain/errors/service.errors';
import type {
  AssignStaffServiceInput,
  StaffServiceOutput,
} from '../dto/staff-service.dto';

@Injectable()
export class AssignStaffServiceUseCase {
  constructor(
    @Inject(STAFF_SERVICE_REPOSITORY)
    private readonly staffServiceRepository: StaffServiceRepository,
    @Inject(STAFF_REPOSITORY)
    private readonly staffRepository: StaffRepository,
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepository: ServiceRepository,
    @Inject(STAFF_SERVICE_ID_GENERATOR)
    private readonly idGenerator: StaffServiceIdGenerator,
  ) {}

  async execute(input: AssignStaffServiceInput): Promise<StaffServiceOutput> {
    const staff = await this.staffRepository.findById(input.staffId);
    if (!staff) {
      throw new StaffNotFoundError(input.staffId);
    }

    const service = await this.serviceRepository.findById(input.serviceId);
    if (!service) {
      throw new ServiceNotFoundError(input.serviceId);
    }

    if (staff.clinicId !== service.clinicId) {
      throw new StaffServiceClinicMismatchError(
        staff.clinicId,
        service.clinicId,
      );
    }

    const existing =
      await this.staffServiceRepository.findByStaffIdAndServiceId(
        input.staffId,
        input.serviceId,
      );

    if (existing) {
      throw new StaffServiceAlreadyExistsError(input.staffId, input.serviceId);
    }

    const id = this.idGenerator.generate();

    const staffService = StaffService.create({
      id,
      staffId: input.staffId,
      serviceId: input.serviceId,
      priceOverride: input.priceOverride,
      durationOverrideMinutes: input.durationOverrideMinutes,
      depositOverride: input.depositOverride,
      isActive: input.isActive,
    });

    await this.staffServiceRepository.save(staffService);

    return staffService.toProperties();
  }
}
