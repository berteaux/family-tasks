export class AuthOutput {
  constructor(
    public readonly access_token: string,
    public readonly token_type: string,
    public readonly expires_in: number,
  ) {}

  static create(accessToken: string, expiresIn: number): AuthOutput {
    return new AuthOutput(accessToken, 'Bearer', expiresIn);
  }
}
