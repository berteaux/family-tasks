import { DomainException } from './domain.exception';

export class NotFoundException extends DomainException {
  constructor(message = 'The requested resource was not found') {
    super(message);
    this.name = 'NotFoundException';
  }
}
