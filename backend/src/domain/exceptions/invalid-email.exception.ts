export class InvalidEmailException extends Error {
  constructor(email: string) {
    super(`Invalid email: ${email}`);
    this.name = 'InvalidEmailException';
  }
}
