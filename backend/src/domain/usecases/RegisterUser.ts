import { USER_REPOSITORY } from '../repositories/IUserRepository';
import type { IUserRepository } from '../repositories/IUserRepository';
import { User } from '../entities/User';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RegisterUser {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: IUserRepository,
  ) {}

  async execute(email: string, password: string): Promise<User> {
    const existing = await this.userRepository.findByEmail(email);

    if (existing) {
      throw new Error('Email already exists');
    }

    const passwordHash = password; //TODO: hash password

    const user = new User(crypto.randomUUID(), email, passwordHash, 'MEMBER');

    await this.userRepository.create(user);

    return user;
  }
}
