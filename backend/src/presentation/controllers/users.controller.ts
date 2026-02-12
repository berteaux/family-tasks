import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  UseGuards,
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
import { CreateUserDto } from '@presentation/dtos/create-user.dto';
import { Roles } from '@presentation/decorators/roles.decorator';
import { JwtAuthGuard } from '@presentation/guards/jwt-auth.guard';
import { RolesGuard } from '@presentation/guards/roles.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    private registerUser: RegisterUser,
  ) {}

  @Get()
  @Roles('MEMBER', 'MANAGER')
  async findAll(): Promise<UserOutput[]> {
    const users = await this.userRepository.findAll();
    return users.map((user: User) => UserOutput.fromDomain(user));
  }

  @Get(':id')
  @Roles('MEMBER', 'MANAGER')
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
  @Roles('MEMBER', 'MANAGER')
  async create(@Body() httpDto: CreateUserDto): Promise<UserOutput> {
    const input = new RegisterUserInput(httpDto.email, httpDto.password);
    const user = await this.registerUser.execute(input);
    return user;
  }
}
