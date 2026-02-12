import { Inject, Injectable } from '@nestjs/common';
import {
  TASK_REPOSITORY,
  type TaskRepository,
} from '@domain/ports/task-repository';
import { Task } from '@domain/entities/Task';
import { TaskOutput } from '@application/dtos/task.output';
import { ForbiddenException } from '@domain/exceptions/forbidden.exception';

export class CreateTaskInput {
  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly currentUserRole: 'MANAGER' | 'MEMBER',
  ) {}
}

@Injectable()
export class CreateTaskUseCase {
  constructor(@Inject(TASK_REPOSITORY) private taskRepo: TaskRepository) {}

  async execute(input: CreateTaskInput): Promise<TaskOutput> {
    if (input.currentUserRole !== 'MANAGER') {
      throw new ForbiddenException('Only managers can create tasks');
    }

    const task = Task.create(input.title, input.description);
    await this.taskRepo.save(task);
    return TaskOutput.fromDomain(task);
  }
}
