import { Test } from '@nestjs/testing';
import { CompleteTaskUseCase } from './complete-task.usecase';
import {
  TASK_REPOSITORY,
  type TaskRepository,
} from '@domain/ports/task-repository';
import { Task } from '@domain/entities/Task';

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

    await useCase.execute({ taskId: task.id, userId: 'user-1' });

    expect(taskRepo.save).toHaveBeenCalledTimes(1);
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

  it('should throw if task not assigned to user', async () => {
    const task = Task.create('Clean room', 'desc');
    task.assignTo('user-1');

    taskRepo.findById.mockResolvedValue(task);

    await expect(
      useCase.execute({
        taskId: task.id,
        userId: 'user-2',
      }),
    ).rejects.toThrow('Task not assigned to this user');
  });

  it('should throw if task not assigned', async () => {
    const task = Task.create('Clean room', 'desc');

    taskRepo.findById.mockResolvedValue(task);

    await expect(
      useCase.execute({
        taskId: task.id,
        userId: 'user-1',
      }),
    ).rejects.toThrow('Task not assigned to this user');
  });

  it('should throw if task already done', async () => {
    const task = Task.create('Clean room', 'desc');
    task.assignTo('user-1');
    task.complete();

    taskRepo.findById.mockResolvedValue(task);

    await expect(
      useCase.execute({
        taskId: task.id,
        userId: 'user-1',
      }),
    ).rejects.toThrow('Already done');
  });
});
