export class WeakPasswordException extends Error {
  constructor(message: string = 'Password is too weak') {
    super(message);
    this.name = 'WeakPasswordException';
  }
}
