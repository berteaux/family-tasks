import { WeakPasswordException } from '@domain/exceptions/weak-password.exception';
import { Password } from './Password';

describe('Password Value Object', () => {
  describe('create', () => {
    it('should create valid password', () => {
      const password = Password.create('Test1234');
      expect(password.getValue()).toBe('Test1234');
    });

    it('should reject password too short', () => {
      expect(() => Password.create('Test12')).toThrow(WeakPasswordException);
    });

    it('should reject password without uppercase', () => {
      expect(() => Password.create('test1234')).toThrow(WeakPasswordException);
    });

    it('should reject password without lowercase', () => {
      expect(() => Password.create('TEST1234')).toThrow(WeakPasswordException);
    });

    it('should reject password without digit', () => {
      expect(() => Password.create('Testtest')).toThrow(WeakPasswordException);
    });
  });
});
