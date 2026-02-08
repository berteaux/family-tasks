import { User } from '@domain/entities/User';
import { USER_REPOSITORY } from '../repositories/IUserRepository';
import type { IUserRepository } from '../repositories/IUserRepository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetAllUsers {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: IUserRepository,
  ) {}

  async execute(): Promise<User[]> {
    return this.userRepository.find();
  }
}
