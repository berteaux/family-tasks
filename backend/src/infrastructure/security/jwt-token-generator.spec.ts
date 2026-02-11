import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { JwtTokenGenerator } from './jwt-token-generator';
import { TokenPayload } from '@domain/ports/token-generator';

describe('JwtTokenGenerator', () => {
  let tokenGenerator: JwtTokenGenerator;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtTokenGenerator,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    tokenGenerator = module.get<JwtTokenGenerator>(JwtTokenGenerator);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('generate', () => {
    it('should generate JWT token with correct claims', async () => {
      const payload: TokenPayload = {
        userId: '123',
        email: 'test@example.com',
        role: 'MEMBER',
      };

      const mockToken = 'mock.jwt.token';
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(mockToken);

      const result = await tokenGenerator.generate(payload);

      expect(result).toBe(mockToken);
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: '123',
        email: 'test@example.com',
        role: 'MEMBER',
      });
    });

    it('should generate token for MANAGER role', async () => {
      const payload: TokenPayload = {
        userId: '456',
        email: 'manager@example.com',
        role: 'MANAGER',
      };

      const mockToken = 'manager.jwt.token';
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(mockToken);

      const result = await tokenGenerator.generate(payload);

      expect(result).toBe(mockToken);
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: '456',
        email: 'manager@example.com',
        role: 'MANAGER',
      });
    });
  });

  describe('verify', () => {
    it('should verify and decode JWT token', async () => {
      const mockDecoded = {
        sub: '123',
        email: 'test@example.com',
        role: 'MEMBER',
        iat: 1234567890,
        exp: 1234654290,
      };

      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(mockDecoded);

      const result = await tokenGenerator.verify('mock.jwt.token');

      expect(result).toEqual({
        userId: '123',
        email: 'test@example.com',
        role: 'MEMBER',
      });
      expect(jwtService.verifyAsync).toHaveBeenCalledWith('mock.jwt.token');
    });

    it('should verify token with MANAGER role', async () => {
      const mockDecoded = {
        sub: '456',
        email: 'manager@example.com',
        role: 'MANAGER',
        iat: 1234567890,
        exp: 1234654290,
      };

      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(mockDecoded);

      const result = await tokenGenerator.verify('manager.jwt.token');

      expect(result).toEqual({
        userId: '456',
        email: 'manager@example.com',
        role: 'MANAGER',
      });
    });

    it('should throw error for invalid token', async () => {
      jest
        .spyOn(jwtService, 'verifyAsync')
        .mockRejectedValue(new Error('Invalid token'));

      await expect(tokenGenerator.verify('invalid.token')).rejects.toThrow(
        'Invalid token',
      );
    });

    it('should throw error for expired token', async () => {
      jest
        .spyOn(jwtService, 'verifyAsync')
        .mockRejectedValue(new Error('jwt expired'));

      await expect(tokenGenerator.verify('expired.token')).rejects.toThrow(
        'jwt expired',
      );
    });
  });

  describe('getExpirationTime', () => {
    it('should return expiration time in seconds', () => {
      const result = tokenGenerator.getExpirationTime();
      expect(result).toBe(86400); // 1 day in seconds
      expect(typeof result).toBe('number');
    });
  });
});
