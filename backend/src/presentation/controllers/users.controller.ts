import type { CreateUserDto } from '../dtos/create-user';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '@domain/ports/user-repository';
import { UserOutput } from '../../application/dtos/user.output';
import { User } from '@domain/entities/User';
import {
  RegisterUser,
  RegisterUserInput,
} from '@application/usecases/user/register-user';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    private registerUser: RegisterUser,
  ) {}

  @Get()
  async findAll(): Promise<UserOutput[]> {
    const users = await this.userRepository.findAll();
    return users.map((user: User) => UserOutput.fromDomain(user));
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<UserOutput | null> {
    if (!id) {
      return null;
    }

    const user = await this.userRepository.findById(id);
    if (!user) {
      return null;
    }

    return UserOutput.fromDomain(user);
  }

  @Post()
  @HttpCode(201)
  async create(@Body() httpDto: CreateUserDto): Promise<UserOutput> {
    const input = new RegisterUserInput(httpDto.email, httpDto.password);
    const user = await this.registerUser.execute(input);
    return user;
  }
}
