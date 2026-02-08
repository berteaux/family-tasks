import { Test } from '@nestjs/testing';
import { AssignTaskUseCase } from './assign-task.usecase';
import {
  TASK_REPOSITORY,
  type TaskRepository,
} from '@domain/ports/task-repository';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '@domain/ports/user-repository';
import { Task } from '@domain/entities/Task';
import { User } from '@domain/entities/User';

describe('AssignTaskUseCase', () => {
  let useCase: AssignTaskUseCase;
  let taskRepo: jest.Mocked<TaskRepository>;
  let userRepo: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AssignTaskUseCase,
        {
          provide: TASK_REPOSITORY,
          useValue: {
            save: jest.fn(),
            findById: jest.fn(),
          },
        },
        {
          provide: USER_REPOSITORY,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get(AssignTaskUseCase);
    taskRepo = module.get(TASK_REPOSITORY);
    userRepo = module.get(USER_REPOSITORY);
  });

  it('should assign task to user', async () => {
    const task = Task.create('Clean room', 'desc');
    const user = User.reconstitute(
      'user-1',
      'test@example.com',
      'hash',
      'MEMBER',
    );

    taskRepo.findById.mockResolvedValue(task);
    userRepo.findById.mockResolvedValue(user);

    await useCase.execute({ taskId: task.id, userId: 'user-1' });

    expect(taskRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: task.id,
      }),
    );
  });

  it('should throw if task not found', async () => {
    taskRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        taskId: 'unknown',
        userId: 'user-1',
      }),
    ).rejects.toThrow('Task not found');
  });

  it('should throw if user not found', async () => {
    const task = Task.create('Clean room', 'desc');
    taskRepo.findById.mockResolvedValue(task);
    userRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        taskId: task.id,
        userId: 'unknown',
      }),
    ).rejects.toThrow('User not found');
  });

  it('should throw if task already assigned', async () => {
    const task = Task.create('Clean room', 'desc');
    task.assignTo('user-1');
    const user = User.reconstitute(
      'user-2',
      'test@example.com',
      'hash',
      'MEMBER',
    );

    taskRepo.findById.mockResolvedValue(task);
    userRepo.findById.mockResolvedValue(user);

    await expect(
      useCase.execute({
        taskId: task.id,
        userId: 'user-2',
      }),
    ).rejects.toThrow('Already assigned');
  });
});
