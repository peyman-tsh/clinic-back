import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { FindUserUseCase } from './application/use-cases/find-user.use-case';
import { FindUsersUseCase } from './application/use-cases/find-users.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { USER_ID_GENERATOR } from './application/ports/user-id-generator';
import { USER_PASSWORD_HASHER } from './application/ports/password-hasher';
import { USER_REPOSITORY } from './domain/repositories/user.repository';
import { TypeOrmUserRepository } from './infrastructure/persistence/typeorm-user.repository';
import { UserOrmEntity } from './infrastructure/persistence/user.orm-entity';
import { UuidUserIdGenerator } from './infrastructure/services/uuid-user-id-generator';
import { BcryptPasswordHasher } from './infrastructure/services/bcrypt-password-hasher';
import { UsersController } from './presentation/http/users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    FindUsersUseCase,
    FindUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    { provide: USER_REPOSITORY, useClass: TypeOrmUserRepository },
    { provide: USER_ID_GENERATOR, useClass: UuidUserIdGenerator },
    { provide: USER_PASSWORD_HASHER, useClass: BcryptPasswordHasher },
  ],
  exports: [
    USER_REPOSITORY,
    USER_PASSWORD_HASHER,
    CreateUserUseCase,
  ],
})
export class UsersModule {}