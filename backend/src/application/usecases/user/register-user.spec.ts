import { Test } from '@nestjs/testing';
import { RegisterUser, RegisterUserInput } from './register-user';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '@domain/ports/user-repository';
import {
  PASSWORD_HASHER,
  type PasswordHasher,
} from '@domain/ports/password-hasher';
import { User } from '@domain/entities/User';
import { EmailAlreadyExistsException } from '@domain/exceptions/email-already-exists.exception';

describe('RegisterUser Use Case', () => {
  let registerUser: RegisterUser;
  let userRepository: UserRepository;
  let passwordHasher: PasswordHasher;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RegisterUser,
        {
          provide: USER_REPOSITORY,
          useValue: {
            save: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
        {
          provide: PASSWORD_HASHER,
          useValue: {
            hash: jest.fn().mockResolvedValue('$2b$10$mockedHashedPassword'),
            compare: jest.fn(),
          },
        },
      ],
    }).compile();

    registerUser = module.get<RegisterUser>(RegisterUser);
    userRepository = module.get<UserRepository>(USER_REPOSITORY);
    passwordHasher = module.get<PasswordHasher>(PASSWORD_HASHER);
  });

  it('should register new user successfully', async () => {
    const email = 'user1@example.com';
    const password = 'Password1';

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);

    const input = new RegisterUserInput(email, password);
    const result = await registerUser.execute(input);

    expect(result.email).toEqual(email);
    expect(passwordHasher.hash).toHaveBeenCalledWith(password);
    expect(userRepository.save).toHaveBeenCalledTimes(1);
    expect(userRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        email: email,
        role: 'MEMBER',
      }),
    );
  });

  it('should throw error if email already exists', async () => {
    const email = 'existing@example.com';
    const existingUser = User.reconstitute('1', email, 'hash', 'MEMBER');

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(existingUser);

    const input = new RegisterUserInput(email, 'Password1');
    await expect(registerUser.execute(input)).rejects.toThrow(
      EmailAlreadyExistsException,
    );
    expect(userRepository.save).not.toHaveBeenCalled();
  });
});
