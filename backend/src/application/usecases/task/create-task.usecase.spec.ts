import { Test } from '@nestjs/testing';
import { CreateTaskUseCase } from './create-task.usecase';
import {
  TASK_REPOSITORY,
  type TaskRepository,
} from '@domain/ports/task-repository';
import { ForbiddenException } from '@domain/exceptions/forbidden.exception';

describe('CreateTaskUseCase', () => {
  let useCase: CreateTaskUseCase;
  let taskRepo: jest.Mocked<TaskRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreateTaskUseCase,
        {
          provide: TASK_REPOSITORY,
          useValue: {
            save: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            findByUserId: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get(CreateTaskUseCase);
    taskRepo = module.get(TASK_REPOSITORY);
  });

  it('should create a task with TODO status', async () => {
    const result = await useCase.execute({
      title: 'Clean room',
      description: 'Clean the bedroom',
      currentUserRole: 'MANAGER',
    });

    expect(result.title).toBe('Clean room');
    expect(result.description).toBe('Clean the bedroom');
    expect(result.status).toBe('TODO');
    expect(result.assignedToUserId).toBeNull();
    expect(taskRepo.save).toHaveBeenCalledTimes(1);
  });

  it('should throw error if a member tries to create a task', async () => {
    await expect(
      useCase.execute({
        title: 'Clean room',
        description: 'Clean the bedroom',
        currentUserRole: 'MEMBER',
      }),
    ).rejects.toThrow(ForbiddenException);
  });
});
