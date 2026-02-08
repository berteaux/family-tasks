import { User } from '@domain/entities/User';

export class UserOutput {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly role: string,
  ) {}

  static fromDomain(user: User): UserOutput {
    return new UserOutput(user.id, user.email, user.role);
  }
}
