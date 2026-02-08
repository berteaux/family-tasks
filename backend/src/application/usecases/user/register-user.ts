import { Inject, Injectable } from '@nestjs/common';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '@domain/ports/user-repository';
import { User } from '@domain/entities/User';
import { UserOutput } from '../../dtos/user.output';

export class RegisterUserInput {
  public readonly email: string;
  public readonly password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}

@Injectable()
export class RegisterUser {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: UserRepository,
  ) {}

  async execute(input: RegisterUserInput): Promise<UserOutput> {
    const existing = await this.userRepository.findByEmail(input.email);

    if (existing) {
      throw new Error('Email already exists');
    }

    const passwordHash = input.password; //TODO: hash password

    const user = User.create(input.email, passwordHash);

    await this.userRepository.save(user);

    return UserOutput.fromDomain(user);
  }
}
