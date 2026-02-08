import { Test } from '@nestjs/testing';
import { RegisterUser } from './RegisterUser';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../repositories/IUserRepository';

describe('RegisterUser', () => {
  let registerUser: RegisterUser;
  let userRepository: IUserRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RegisterUser,
        {
          provide: USER_REPOSITORY,
          useValue: {
            create: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    registerUser = module.get<RegisterUser>(RegisterUser);
    userRepository = module.get<IUserRepository>(USER_REPOSITORY);
  });

  it('should create a user', async () => {
    const email = 'user1@example.com';
    const password = 'pass1';

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);

    const result = await registerUser.execute(email, password);

    expect(result.email).toEqual(email);
    expect(userRepository.create).toHaveBeenCalled();
  });

  it('should throw error if email already exists', async () => {
    const email = 'existing@example.com';
    const password = 'pass1';

    jest
      .spyOn(userRepository, 'findByEmail')
      .mockResolvedValue({ id: '1', email, passwordHash: '', role: 'MEMBER' });

    await expect(registerUser.execute(email, password)).rejects.toThrow();
    expect(userRepository.create).toHaveBeenCalled();
  });
});
