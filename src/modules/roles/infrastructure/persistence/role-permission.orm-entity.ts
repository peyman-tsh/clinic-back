import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { PermissionOrmEntity } from './permission.orm-entity';
import { RoleOrmEntity } from './role.orm-entity';

@Entity({ name: 'role_permissions' })
export class RolePermissionOrmEntity {
  @PrimaryColumn({ name: 'role_id', type: 'uuid' })
  roleId!: string;

  @PrimaryColumn({ name: 'permission_id', type: 'uuid' })
  permissionId!: string;

  @ManyToOne(() => RoleOrmEntity, (role) => role.permissionAssignments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role!: RoleOrmEntity;

  @ManyToOne(() => PermissionOrmEntity, (permission) => permission.roleAssignments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'permission_id' })
  permission!: PermissionOrmEntity;
}
