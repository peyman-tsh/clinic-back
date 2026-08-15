import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StaffStatus } from '../../domain/entities/staff';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/user.orm-entity';
import { ClinicOrmEntity } from '../../../clinics/infrastructure/persistence/clinic.orm-entity';
import { StaffBranchOrmEntity } from './staff-branch.orm-entity';

@Entity({ name: 'staff' })
@Index('staff_clinic_id_idx', ['clinicId'])
@Index('staff_status_idx', ['status'])
export class StaffOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ name: 'user_id', type: 'uuid', unique: true })
  userId!: string;

  @OneToOne(() => UserOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserOrmEntity;

  @Column({ name: 'clinic_id', type: 'uuid' })
  clinicId!: string;

  @ManyToOne(() => ClinicOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clinic_id' })
  clinic!: ClinicOrmEntity;

  @Column({ name: 'job_title', type: 'varchar', length: 100, nullable: true })
  jobTitle!: string | null;

  @Column({ type: 'text', nullable: true })
  bio!: string | null;

  @Column({ name: 'license_number', type: 'varchar', length: 100, nullable: true })
  licenseNumber!: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  color!: string | null;

  @Column({
    type: 'enum',
    enum: StaffStatus,
    default: StaffStatus.ACTIVE,
  })
  status!: StaffStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt!: Date | null;

  @OneToMany(() => StaffBranchOrmEntity, (staffBranch) => staffBranch.staff, {
    cascade: true,
  })
  branches!: StaffBranchOrmEntity[];
}
