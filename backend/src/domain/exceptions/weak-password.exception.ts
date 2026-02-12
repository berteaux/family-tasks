import { DomainException } from './domain.exception';

export class WeakPasswordException extends DomainException {
  constructor(message: string = 'Password is too weak') {
    super(message);
    this.name = 'WeakPasswordException';
  }
}
