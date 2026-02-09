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
    const email = Email.create(input.email);
    const password = Password.create(input.password);

    const existing = await this.userRepository.findByEmail(email.getValue());

    if (existing) {
      throw new EmailAlreadyExistsException(email.getValue());
    }

    const passwordHash = password.getValue(); //TODO: hash password

    const user = User.create(input.email, passwordHash);

    await this.userRepository.save(user);

    return UserOutput.fromDomain(user);
  }
}
