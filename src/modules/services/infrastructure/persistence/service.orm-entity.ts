import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ClinicOrmEntity } from '../../../clinics/infrastructure/persistence/clinic.orm-entity';
import { ServiceCategoryOrmEntity } from '../../../service-categories/infrastructure/persistence/service-category.orm-entity';
import { StaffServiceOrmEntity } from '../../../staff-services/infrastructure/persistence/staff-service.orm-entity';

@Entity({ name: 'services' })
@Index('services_clinic_id_idx', ['clinicId'])
@Index('services_category_id_idx', ['categoryId'])
@Index('services_is_active_idx', ['isActive'])
export class ServiceOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ name: 'clinic_id', type: 'uuid' })
  clinicId!: string;

  @ManyToOne(() => ClinicOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clinic_id' })
  clinic!: ClinicOrmEntity;

  @Column({ name: 'category_id', type: 'uuid' })
  categoryId!: string;

  @ManyToOne(() => ServiceCategoryOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category!: ServiceCategoryOrmEntity;

  @Column({ type: 'varchar', length: 150 })
  name!: string;

  @Column({ type: 'varchar', length: 150 })
  slug!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
  imageUrl!: string | null;

  @Column({ name: 'duration_minutes', type: 'integer' })
  durationMinutes!: number;

  @Column({ name: 'buffer_before_minutes', type: 'integer', default: 0 })
  bufferBeforeMinutes!: number;

  @Column({ name: 'buffer_after_minutes', type: 'integer', default: 0 })
  bufferAfterMinutes!: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    transformer: {
      to: (val: number) => val,
      from: (val: string) => parseFloat(val),
    },
  })
  price!: number;

  @Column({
    name: 'deposit_amount',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: {
      to: (val: number | null) => val,
      from: (val: string | null) => (val ? parseFloat(val) : null),
    },
  })
  depositAmount!: number | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ name: 'sort_order', type: 'integer', default: 0 })
  sortOrder!: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt!: Date | null;

  @OneToMany(
    () => StaffServiceOrmEntity,
    (staffService) => staffService.service,
  )
  staffServices!: StaffServiceOrmEntity[];
}
