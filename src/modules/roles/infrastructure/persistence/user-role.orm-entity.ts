import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/user.orm-entity';
import { RoleOrmEntity } from './role.orm-entity';

@Entity({ name: 'user_roles' })
export class UserRoleOrmEntity {
  @PrimaryColumn({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @PrimaryColumn({ name: 'role_id', type: 'uuid' })
  roleId!: string;

  @ManyToOne(() => UserOrmEntity, (user) => user.roleAssignments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: UserOrmEntity;

  @ManyToOne(() => RoleOrmEntity, (role) => role.userAssignments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role!: RoleOrmEntity;
}
