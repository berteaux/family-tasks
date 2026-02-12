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
import { NotFoundException } from '@domain/exceptions/not-found.exception';
import { ForbiddenException } from '@domain/exceptions/forbidden.exception';

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

    await useCase.execute({
      taskId: task.id,
      userId: 'user-1',
      currentUserRole: 'MANAGER',
    });

    expect(taskRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: task.id,
      }),
    );
  });

  it('should throw if user is not a manager', async () => {
    await expect(
      useCase.execute({
        taskId: 'unknown',
        userId: 'user-1',
        currentUserRole: 'MEMBER',
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should throw if task not found', async () => {
    taskRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        taskId: 'unknown',
        userId: 'user-1',
        currentUserRole: 'MANAGER',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw if user not found', async () => {
    const task = Task.create('Clean room', 'desc');
    taskRepo.findById.mockResolvedValue(task);
    userRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        taskId: task.id,
        userId: 'unknown',
        currentUserRole: 'MANAGER',
      }),
    ).rejects.toThrow(NotFoundException);
  });
});
