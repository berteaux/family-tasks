import { TokenGenerator, TokenPayload } from '@domain/ports/token-generator';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtTokenGenerator implements TokenGenerator {
  private readonly expirationTime: number;

  constructor(private jwtService: JwtService) {
    this.expirationTime = parseInt(
      process.env.JWT_EXPIRES_IN_SECONDS || '86400',
    );
  }

  async generate(payload: TokenPayload): Promise<string> {
    return this.jwtService.signAsync({
      sub: payload.userId,
      email: payload.email,
      role: payload.role,
    });
  }

  async verify(token: string): Promise<TokenPayload> {
    const decoded = await this.jwtService.verifyAsync(token);
    return {
      userId: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };
  }

  getExpirationTime(): number {
    return this.expirationTime;
  }
}
