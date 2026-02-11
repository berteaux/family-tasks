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
import {
  TOKEN_GENERATOR,
  type TokenGenerator,
} from '@domain/ports/token-generator';
import { AuthOutput } from '@application/dtos/auth.output';

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
    @Inject(TOKEN_GENERATOR) private tokenGenerator: TokenGenerator,
  ) {}

  async execute(input: SigninInput): Promise<AuthOutput> {
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

    const token = await this.tokenGenerator.generate({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const expiresIn = this.tokenGenerator.getExpirationTime();

    return AuthOutput.create(token, expiresIn);
  }
}
