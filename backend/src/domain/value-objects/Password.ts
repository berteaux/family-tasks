import { WeakPasswordException } from '@domain/exceptions/weak-password.exception';

// domain/value-objects/Password.ts
export class Password {
  private constructor(private readonly value: string) {}

  static create(plainPassword: string): Password {
    if (plainPassword.length < 8) {
      throw new WeakPasswordException(
        'Password must be at least 8 characters long',
      );
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(plainPassword)) {
      throw new WeakPasswordException(
        'Password must contain uppercase, lowercase and digit',
      );
    }

    return new Password(plainPassword);
  }

  getValue(): string {
    return this.value;
  }
}
