import { Inject, Injectable } from '@nestjs/common';
import { UserNotFoundError } from '../../domain/errors/user.errors';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { toUserOutput, UserOutput } from '../dto/user.dto';

@Injectable()
export class FindUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
  ) {}

  async execute(id: string): Promise<UserOutput> {
    const user = await this.users.findById(id);

    if (!user) {
      throw new UserNotFoundError(id);
    }

    return toUserOutput(user);
  }
}
