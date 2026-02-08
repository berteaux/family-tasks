// 2-application/dtos/register-user.input.ts
export class RegisterUserInput {
  public readonly email: string;
  public readonly password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
