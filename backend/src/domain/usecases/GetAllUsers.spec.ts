import { Test } from '@nestjs/testing';
import { GetAllUsers } from './GetAllUsers';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../repositories/IUserRepository';
import { User } from '../entities/User';

describe('GetAllUsers', () => {
  let getAllUsers: GetAllUsers;
  let userRepository: IUserRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetAllUsers,
        {
          provide: USER_REPOSITORY,
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    getAllUsers = module.get<GetAllUsers>(GetAllUsers);
    userRepository = module.get<IUserRepository>(USER_REPOSITORY);
  });

  it('should return an empty array if no users exist', async () => {
    jest.spyOn(userRepository, 'find').mockResolvedValue([]);

    const result = await getAllUsers.execute();

    expect(result).toEqual([]);
    expect(userRepository.find).toHaveBeenCalled();
  });

  it('should return a list of users', async () => {
    const users = [
      new User('1', 'user1@example.com', 'pass1', 'MEMBER'),
      new User('2', 'user2@example.com', 'pass2', 'MEMBER'),
    ];
    jest.spyOn(userRepository, 'find').mockResolvedValue(users);

    const result = await getAllUsers.execute();

    expect(result).toEqual(users);
    expect(userRepository.find).toHaveBeenCalled();
  });
});
