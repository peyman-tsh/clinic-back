import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { RolePermissionOrmEntity } from './role-permission.orm-entity';
import { UserRoleOrmEntity } from './user-role.orm-entity';

@Entity({ name: 'roles' })
export class RoleOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @Column({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt!: Date | null;

  @OneToMany(() => RolePermissionOrmEntity, (assignment) => assignment.role)
  permissionAssignments!: RolePermissionOrmEntity[];

  @OneToMany(() => UserRoleOrmEntity, (assignment) => assignment.role)
  userAssignments!: UserRoleOrmEntity[];
}
