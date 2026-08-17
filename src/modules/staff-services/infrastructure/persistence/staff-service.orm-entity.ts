import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { StaffOrmEntity } from '../../../staff/infrastructure/persistence/staff.orm-entity';
import { ServiceOrmEntity } from '../../../services/infrastructure/persistence/service.orm-entity';

@Entity({ name: 'staff_services' })
@Unique(['staffId', 'serviceId'])
@Index('staff_services_staff_id_idx', ['staffId'])
@Index('staff_services_service_id_idx', ['serviceId'])
@Index('staff_services_is_active_idx', ['isActive'])
export class StaffServiceOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ name: 'staff_id', type: 'uuid' })
  staffId!: string;

  @ManyToOne(() => StaffOrmEntity, (staff) => staff.services, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'staff_id' })
  staff!: StaffOrmEntity;

  @Column({ name: 'service_id', type: 'uuid' })
  serviceId!: string;

  @ManyToOne(() => ServiceOrmEntity, (service) => service.staffServices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'service_id' })
  service!: ServiceOrmEntity;

  @Column({
    name: 'price_override',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: {
      to: (val: number | null) => val,
      from: (val: string | null) =>
        val !== null && val !== undefined ? parseFloat(val) : null,
    },
  })
  priceOverride!: number | null;

  @Column({
    name: 'duration_override_minutes',
    type: 'integer',
    nullable: true,
  })
  durationOverrideMinutes!: number | null;

  @Column({
    name: 'deposit_override',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: {
      to: (val: number | null) => val,
      from: (val: string | null) =>
        val !== null && val !== undefined ? parseFloat(val) : null,
    },
  })
  depositOverride!: number | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
