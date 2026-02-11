export interface TokenPayload {
  userId: string;
  email: string;
  role: 'MANAGER' | 'MEMBER';
}

export interface TokenGenerator {
  generate(payload: TokenPayload): Promise<string>;
  verify(token: string): Promise<TokenPayload>;
  getExpirationTime(): number;
}

export const TOKEN_GENERATOR = Symbol('TOKEN_GENERATOR');
