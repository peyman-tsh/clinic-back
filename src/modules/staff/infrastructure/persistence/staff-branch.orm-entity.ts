import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { StaffOrmEntity } from './staff.orm-entity';
import { BranchOrmEntity } from '../../../branches/infrastructure/persistence/branch.orm-entity';

@Entity({ name: 'staff_branches' })
@Unique(['staffId', 'branchId'])
@Index('staff_branches_staff_id_idx', ['staffId'])
@Index('staff_branches_branch_id_idx', ['branchId'])
export class StaffBranchOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ name: 'staff_id', type: 'uuid' })
  staffId!: string;

  @ManyToOne(() => StaffOrmEntity, (staff) => staff.branches, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'staff_id' })
  staff!: StaffOrmEntity;

  @Column({ name: 'branch_id', type: 'uuid' })
  branchId!: string;

  @ManyToOne(() => BranchOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'branch_id' })
  branch!: BranchOrmEntity;

  @Column({ name: 'is_primary', type: 'boolean', default: false })
  isPrimary!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
