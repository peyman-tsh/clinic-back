import { Inject, Injectable } from '@nestjs/common';
import { UserNotFoundError } from '../../domain/errors/user.errors';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import type { UserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
  ) {}

  async execute(id: string): Promise<void> {
    if (!(await this.users.findById(id))) {
      throw new UserNotFoundError(id);
    }

    await this.users.delete(id);
  }
}
