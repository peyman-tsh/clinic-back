import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseFilters,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.use-case';
import { FindUserUseCase } from '../../application/use-cases/find-user.use-case';
import { FindUsersUseCase } from '../../application/use-cases/find-users.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';
import { CreateUserRequest } from './dto/create-user.request';
import { UpdateUserRequest } from './dto/update-user.request';
import { UserResponse } from './dto/user.response';
import { UsersExceptionFilter } from './users-exception.filter';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseFilters(UsersExceptionFilter)
export class UsersController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly findUsers: FindUsersUseCase,
    private readonly findUser: FindUserUseCase,
    private readonly updateUser: UpdateUserUseCase,
    private readonly deleteUser: DeleteUserUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: UserResponse,
  })
  async create(@Body() request: CreateUserRequest): Promise<UserResponse> {
    return UserResponse.from(await this.createUser.execute(request));
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ description: 'List of users', type: [UserResponse] })
  async findAll(): Promise<UserResponse[]> {
    return (await this.findUsers.execute()).map(UserResponse.from);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiOkResponse({ description: 'User found', type: UserResponse })
  async findOne(@Param('id') id: string): Promise<UserResponse> {
    return UserResponse.from(await this.findUser.execute(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiOkResponse({
    description: 'User updated successfully',
    type: UserResponse,
  })
  async update(
    @Param('id') id: string,
    @Body() request: UpdateUserRequest,
  ): Promise<UserResponse> {
    return UserResponse.from(await this.updateUser.execute(id, request));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiNoContentResponse({ description: 'User deleted successfully' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteUser.execute(id);
  }
}
