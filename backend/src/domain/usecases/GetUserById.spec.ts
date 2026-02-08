import { Test } from '@nestjs/testing';
import { GetUserById } from './GetUserById';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../repositories/IUserRepository';
import { User } from '../entities/User';

describe('GetAllUsers', () => {
  let getUserById: GetUserById;
  let userRepository: IUserRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetUserById,
        {
          provide: USER_REPOSITORY,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    getUserById = module.get<GetUserById>(GetUserById);
    userRepository = module.get<IUserRepository>(USER_REPOSITORY);
  });

  it('should return an empty value if user does not exist', async () => {
    jest.spyOn(userRepository, 'findById').mockResolvedValue(null);

    const result = await getUserById.execute('nonexistent-id');

    expect(result).toBeNull();
    expect(userRepository.findById).toHaveBeenCalledWith('nonexistent-id');
  });

  it('should return a user if it exists', async () => {
    const user = new User('1', 'user1@example.com', 'pass1', 'MEMBER');
    jest.spyOn(userRepository, 'findById').mockResolvedValue(user);
    const result = await getUserById.execute('1');

    expect(result).toEqual(user);
    expect(userRepository.findById).toHaveBeenCalledWith('1');
  });
});
