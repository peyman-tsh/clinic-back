import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { toUserOutput, UserOutput } from '../dto/user.dto';

@Injectable()
export class FindUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
  ) {}

  async execute(): Promise<UserOutput[]> {
    return (await this.users.findAll()).map(toUserOutput);
  }
}
