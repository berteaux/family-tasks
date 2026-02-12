import { DomainException } from './domain.exception';

export class EmailAlreadyExistsException extends DomainException {
  constructor(email: string) {
    super(`The email ${email} is already in use`);
    this.name = 'EmailAlreadyExistsException';
  }
}
