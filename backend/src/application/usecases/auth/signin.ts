import { Inject, Injectable } from '@nestjs/common';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '@domain/ports/user-repository';
import {
  PASSWORD_HASHER,
  type PasswordHasher,
} from '@domain/ports/password-hasher';
import { InvalidCredentialsException } from '@domain/exceptions/invalid-credentials.exception';

export class SigninInput {
  public readonly email: string;
  public readonly password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}

@Injectable()
export class Signin {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: UserRepository,
    @Inject(PASSWORD_HASHER) private passwordHasher: PasswordHasher,
  ) {}

  async execute(input: SigninInput): Promise<boolean> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new InvalidCredentialsException();
    }

    const passwordMatch = await this.passwordHasher.compare(
      input.password,
      user.passwordHash,
    );

    if (!passwordMatch) {
      throw new InvalidCredentialsException();
    }

    return true;
    // Authentication successful, you can return a token or user info here instead of just true
  }
}
