import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { GetAllUsers } from '@src/domain/usecases/GetAllUsers';
import { GetUserById } from '@domain/usecases/GetUserById';
import { RegisterUser } from '@domain/usecases/RegisterUser';
import { UserResponseDto } from '@presentation/dtos/user-response';
import type { CreateUserDto } from '../dtos/create-user';

@Controller('users')
export class UsersController {
  constructor(
    private registerUser: RegisterUser,
    private getUserById: GetUserById,
    private getAllUsers: GetAllUsers,
  ) {}

  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.getAllUsers.execute();

    return users.map((user: UserResponseDto) => ({
      id: user.id,
      email: user.email,
      role: user.role,
    }));
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<UserResponseDto | null> {
    if (!id) {
      return null;
    }

    const user = await this.getUserById.execute(id);
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    } as UserResponseDto;
  }

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.registerUser.execute(dto.email, dto.password);

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
