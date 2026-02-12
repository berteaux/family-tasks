import { DomainException } from './domain.exception';

export class ForbiddenException extends DomainException {
  constructor(message = 'You do not have permission to perform this action') {
    super(message);
    this.name = 'ForbiddenException';
  }
}
