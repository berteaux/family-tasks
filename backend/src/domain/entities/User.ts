import { randomUUID } from 'crypto';

export class User {
  private constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly role: 'MANAGER' | 'MEMBER',
  ) {}

  static create(email: string, hashedPassword: string): User {
    // TODO: Validate email here
    return new User(randomUUID(), email, hashedPassword, 'MEMBER');
  }

  static reconstitute(
    id: string,
    email: string,
    passwordHash: string,
    role: 'MANAGER' | 'MEMBER',
  ): User {
    return new User(id, email, passwordHash, role);
  }
}
