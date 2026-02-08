import { User } from '@domain/entities/User';
import { USER_REPOSITORY } from '../repositories/IUserRepository';
import type { IUserRepository } from '../repositories/IUserRepository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetUserByEmail {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: IUserRepository,
  ) {}

  async execute(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }
}
