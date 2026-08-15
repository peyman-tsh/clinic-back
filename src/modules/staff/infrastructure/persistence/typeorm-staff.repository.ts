import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Staff, StaffBranchProperties, StaffProperties } from '../../domain/entities/staff';
import { StaffBranchAlreadyAssignedError, UserAlreadyHasStaffProfileError } from '../../domain/errors/staff.errors';
import type { StaffRepository } from '../../domain/repositories/staff.repository';
import { StaffOrmEntity } from './staff.orm-entity';
import { StaffBranchOrmEntity } from './staff-branch.orm-entity';

@Injectable()
export class TypeOrmStaffRepository implements StaffRepository {
  constructor(
    @InjectRepository(StaffOrmEntity)
    private readonly staffRepo: Repository<StaffOrmEntity>,
    @InjectRepository(StaffBranchOrmEntity)
    private readonly staffBranchRepo: Repository<StaffBranchOrmEntity>,
  ) {}

  async save(staff: Staff): Promise<void> {
    try {
      await this.staffRepo.save(this.toEntity(staff));
    } catch (error: unknown) {
      if (this.isUniqueViolation(error)) {
        throw new UserAlreadyHasStaffProfileError(staff.userId);
      }
      throw error;
    }
  }

  async findById(id: string): Promise<Staff | null> {
    const entity = await this.staffRepo.findOne({
      where: { id },
      relations: { branches: true },
    });

    return entity ? this.toDomain(entity) : null;
  }

  async findByUserId(userId: string): Promise<Staff | null> {
    const entity = await this.staffRepo.findOne({
      where: { userId },
      relations: { branches: true },
    });

    return entity ? this.toDomain(entity) : null;
  }

  async findByClinicId(clinicId: string): Promise<Staff[]> {
    const entities = await this.staffRepo.find({
      where: { clinicId },
      relations: { branches: true },
      order: { createdAt: 'DESC', id: 'DESC' },
    });

    return entities.map((entity) => this.toDomain(entity));
  }

  async findAll(): Promise<Staff[]> {
    const entities = await this.staffRepo.find({
      relations: { branches: true },
      order: { createdAt: 'DESC', id: 'DESC' },
    });

    return entities.map((entity) => this.toDomain(entity));
  }

  async delete(id: string): Promise<void> {
    await this.staffRepo.softDelete(id);
  }

  async assignBranch(assignment: StaffBranchProperties): Promise<void> {
    try {
      if (assignment.isPrimary) {
        await this.staffBranchRepo.update(
          { staffId: assignment.staffId },
          { isPrimary: false },
        );
      }

      await this.staffBranchRepo.save({
        id: assignment.id,
        staffId: assignment.staffId,
        branchId: assignment.branchId,
        isPrimary: assignment.isPrimary,
        createdAt: assignment.createdAt,
      });
    } catch (error: unknown) {
      if (this.isUniqueViolation(error)) {
        throw new StaffBranchAlreadyAssignedError(
          assignment.staffId,
          assignment.branchId,
        );
      }
      throw error;
    }
  }

  async removeBranch(staffId: string, branchId: string): Promise<void> {
    await this.staffBranchRepo.delete({ staffId, branchId });
  }

  private toDomain(entity: StaffOrmEntity): Staff {
    const branches: StaffBranchProperties[] = (entity.branches ?? []).map((b) => ({
      id: b.id,
      staffId: b.staffId,
      branchId: b.branchId,
      isPrimary: b.isPrimary,
      createdAt: b.createdAt,
    }));

    const properties: StaffProperties = {
      id: entity.id,
      userId: entity.userId,
      clinicId: entity.clinicId,
      jobTitle: entity.jobTitle,
      bio: entity.bio,
      licenseNumber: entity.licenseNumber,
      color: entity.color,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
      branches,
    };

    return Staff.rehydrate(properties);
  }

  private toEntity(staff: Staff): StaffOrmEntity {
    const props = staff.toProperties();
    const entity = new StaffOrmEntity();
    entity.id = props.id;
    entity.userId = props.userId;
    entity.clinicId = props.clinicId;
    entity.jobTitle = props.jobTitle;
    entity.bio = props.bio;
    entity.licenseNumber = props.licenseNumber;
    entity.color = props.color;
    entity.status = props.status;
    entity.createdAt = props.createdAt;
    entity.updatedAt = props.updatedAt;
    entity.deletedAt = props.deletedAt;
    return entity;
  }

  private isUniqueViolation(error: unknown): boolean {
    if (typeof error !== 'object' || error === null || !('driverError' in error)) {
      return false;
    }

    const { driverError } = error;
    return (
      typeof driverError === 'object' &&
      driverError !== null &&
      'code' in driverError &&
      driverError.code === '23505'
    );
  }
}
