import { InvalidEmailException } from '@domain/exceptions/invalid-email.exception';
import { Email } from './Email';

describe('Email Value Object', () => {
  describe('create', () => {
    it('should create valid email', () => {
      const email = Email.create('test@example.com');
      expect(email.getValue()).toBe('test@example.com');
    });

    it('should normalize to lowercase', () => {
      const email = Email.create('Test@Example.COM');
      expect(email.getValue()).toBe('test@example.com');
    });

    it('should throw on invalid format', () => {
      expect(() => Email.create('notanemail')).toThrow(InvalidEmailException);
      expect(() => Email.create('')).toThrow(InvalidEmailException);
      expect(() => Email.create('test@')).toThrow(InvalidEmailException);
    });
  });
});
