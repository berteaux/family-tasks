import { Test } from '@nestjs/testing';
import { Signin, SigninInput } from './signin';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '@domain/ports/user-repository';
import {
  PASSWORD_HASHER,
  type PasswordHasher,
} from '@domain/ports/password-hasher';
import {
  TOKEN_GENERATOR,
  type TokenGenerator,
} from '@domain/ports/token-generator';
import { User } from '@domain/entities/User';
import { InvalidCredentialsException } from '@domain/exceptions/invalid-credentials.exception';
import { AuthOutput } from '@application/dtos/auth.output';

describe('Signin Use Case', () => {
  let signin: Signin;
  let userRepository: UserRepository;
  let passwordHasher: PasswordHasher;
  let tokenGenerator: TokenGenerator;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        Signin,
        {
          provide: USER_REPOSITORY,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: PASSWORD_HASHER,
          useValue: {
            compare: jest.fn(),
          },
        },
        {
          provide: TOKEN_GENERATOR,
          useValue: {
            generate: jest.fn(),
            verify: jest.fn(),
            getExpirationTime: jest.fn(),
          },
        },
      ],
    }).compile();

    signin = module.get<Signin>(Signin);
    userRepository = module.get<UserRepository>(USER_REPOSITORY);
    passwordHasher = module.get<PasswordHasher>(PASSWORD_HASHER);
    tokenGenerator = module.get<TokenGenerator>(TOKEN_GENERATOR);
  });

  it('should sign in successfully with valid credentials', async () => {
    const email = 'user@example.com';
    const password = 'Password1';
    const hashedPassword = '$2b$10$hashedpassword';
    const mockToken = 'mock.jwt.token';
    const mockExpiresIn = 86400;

    const existingUser = User.reconstitute(
      '1',
      email,
      hashedPassword,
      'MEMBER',
    );

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(existingUser);
    jest.spyOn(passwordHasher, 'compare').mockResolvedValue(true);
    jest.spyOn(tokenGenerator, 'generate').mockResolvedValue(mockToken);
    jest.spyOn(tokenGenerator, 'getExpirationTime').mockReturnValue(mockExpiresIn);

    const input = new SigninInput(email, password);
    const result = await signin.execute(input);

    expect(result).toBeInstanceOf(AuthOutput);
    expect(result.access_token).toBe(mockToken);
    expect(result.token_type).toBe('Bearer');
    expect(result.expires_in).toBe(mockExpiresIn);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
    expect(passwordHasher.compare).toHaveBeenCalledWith(
      password,
      hashedPassword,
    );
    expect(tokenGenerator.generate).toHaveBeenCalledWith({
      userId: '1',
      email: email,
      role: 'MEMBER',
    });
    expect(tokenGenerator.getExpirationTime).toHaveBeenCalled();
  });

  it('should throw InvalidCredentialsException when user does not exist', async () => {
    const email = 'nonexistent@example.com';
    const password = 'Password1';

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);

    const input = new SigninInput(email, password);

    await expect(signin.execute(input)).rejects.toThrow(
      InvalidCredentialsException,
    );
    expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
    expect(passwordHasher.compare).not.toHaveBeenCalled();
    expect(tokenGenerator.generate).not.toHaveBeenCalled();
  });

  it('should throw InvalidCredentialsException when password is incorrect', async () => {
    const email = 'user@example.com';
    const password = 'WrongPassword1';
    const hashedPassword = '$2b$10$hashedpassword';
    const existingUser = User.reconstitute(
      '1',
      email,
      hashedPassword,
      'MEMBER',
    );

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(existingUser);
    jest.spyOn(passwordHasher, 'compare').mockResolvedValue(false);

    const input = new SigninInput(email, password);

    await expect(signin.execute(input)).rejects.toThrow(
      InvalidCredentialsException,
    );
    expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
    expect(passwordHasher.compare).toHaveBeenCalledWith(
      password,
      hashedPassword,
    );
    expect(tokenGenerator.generate).not.toHaveBeenCalled();
  });
});
