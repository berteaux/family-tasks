import { Test } from '@nestjs/testing';
import { RegisterUser } from './register-user';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '@domain/ports/user-repository';
import { User } from '@domain/entities/User';
import { RegisterUserInput } from '@application/dtos/register-user.input';

describe('RegisterUser', () => {
  let registerUser: RegisterUser;
  let userRepository: UserRepository;

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
      ],
    }).compile();

    registerUser = module.get<RegisterUser>(RegisterUser);
    userRepository = module.get<UserRepository>(USER_REPOSITORY);
  });

  it('should create a user', async () => {
    const email = 'user1@example.com';
    const password = 'pass1';

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);

    const input = new RegisterUserInput(email, password);
    const result = await registerUser.execute(input);

    expect(result.email).toEqual(email);
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

    const input = new RegisterUserInput(email, 'pass');
    await expect(registerUser.execute(input)).rejects.toThrow(
      'Email already exists',
    );
  });
});
