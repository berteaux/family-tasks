import { Inject, Injectable } from '@nestjs/common';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '@domain/ports/user-repository';
import { User } from '@domain/entities/User';
import { UserOutput } from '../../dtos/user.output';
import { Email } from '@domain/value-objects/Email';
import { Password } from '@domain/value-objects/Password';
import { EmailAlreadyExistsException } from '@domain/exceptions/email-already-exists.exception';
import {
  PASSWORD_HASHER,
  type PasswordHasher,
} from '@domain/ports/password-hasher';

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
    @Inject(PASSWORD_HASHER) private passwordHasher: PasswordHasher,
  ) {}

  async execute(input: RegisterUserInput): Promise<UserOutput> {
    const email = Email.create(input.email);
    const password = Password.create(input.password);

    const existing = await this.userRepository.findByEmail(email.getValue());

    if (existing) {
      throw new EmailAlreadyExistsException(email.getValue());
    }

    const passwordHash = await this.passwordHasher.hash(password.getValue());

    const user = User.create(input.email, passwordHash);

    await this.userRepository.save(user);

    return UserOutput.fromDomain(user);
  }
}
