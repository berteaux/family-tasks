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
import { User } from '@domain/entities/User';
import { InvalidCredentialsException } from '@domain/exceptions/invalid-credentials.exception';

describe('Signin Use Case', () => {
  let signin: Signin;
  let userRepository: UserRepository;
  let passwordHasher: PasswordHasher;

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
      ],
    }).compile();

    signin = module.get<Signin>(Signin);
    userRepository = module.get<UserRepository>(USER_REPOSITORY);
    passwordHasher = module.get<PasswordHasher>(PASSWORD_HASHER);
  });

  it('should sign in successfully with valid credentials', async () => {
    const email = 'user@example.com';
    const password = 'Password1';
    const hashedPassword = '$2b$10$hashedpassword';
    const existingUser = User.reconstitute(
      '1',
      email,
      hashedPassword,
      'MEMBER',
    );

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(existingUser);
    jest.spyOn(passwordHasher, 'compare').mockResolvedValue(true);

    const input = new SigninInput(email, password);
    const result = await signin.execute(input);

    expect(result).toBe(true);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
    expect(passwordHasher.compare).toHaveBeenCalledWith(
      password,
      hashedPassword,
    );
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
  });
});
