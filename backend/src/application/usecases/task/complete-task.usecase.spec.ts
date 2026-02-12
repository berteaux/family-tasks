import { Test } from '@nestjs/testing';
import { CompleteTaskUseCase } from './complete-task.usecase';
import {
  TASK_REPOSITORY,
  type TaskRepository,
} from '@domain/ports/task-repository';
import { Task } from '@domain/entities/Task';
import { NotFoundException } from '@domain/exceptions/not-found.exception';
import { ForbiddenException } from '@domain/exceptions/forbidden.exception';

describe('CompleteTaskUseCase', () => {
  let useCase: CompleteTaskUseCase;
  let taskRepo: jest.Mocked<TaskRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CompleteTaskUseCase,
        {
          provide: TASK_REPOSITORY,
          useValue: {
            save: jest.fn(),
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get(CompleteTaskUseCase);
    taskRepo = module.get(TASK_REPOSITORY);
  });

  it('should complete an assigned task', async () => {
    const task = Task.create('Clean room', 'desc');
    task.assignTo('user-1');

    taskRepo.findById.mockResolvedValue(task);

    await useCase.execute({
      taskId: task.id,
      currentUserId: 'user-1',
      currentUserRole: 'MEMBER',
    });

    expect(taskRepo.save).toHaveBeenCalledTimes(1);
  });

  it('should complete an assigned task if user is manager', async () => {
    const task = Task.create('Clean room', 'desc');
    task.assignTo('user-1');

    taskRepo.findById.mockResolvedValue(task);

    await useCase.execute({
      taskId: task.id,
      currentUserId: 'user-2',
      currentUserRole: 'MANAGER',
    });

    expect(taskRepo.save).toHaveBeenCalledTimes(1);
  });

  it('should throw if task not found', async () => {
    taskRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        taskId: 'unknown',
        currentUserId: 'user-1',
        currentUserRole: 'MANAGER',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw if a member tries to complete a task not assigned to the member', async () => {
    const task = Task.create('Clean room', 'desc');
    task.assignTo('user-1');

    taskRepo.findById.mockResolvedValue(task);

    await expect(
      useCase.execute({
        taskId: task.id,
        currentUserId: 'user-2',
        currentUserRole: 'MEMBER',
      }),
    ).rejects.toThrow(ForbiddenException);
  });
});
