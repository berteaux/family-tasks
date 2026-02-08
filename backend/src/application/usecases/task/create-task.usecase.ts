import { Inject, Injectable } from '@nestjs/common';
import {
  TASK_REPOSITORY,
  type TaskRepository,
} from '@domain/ports/task-repository';
import { Task } from '@domain/entities/Task';
import { TaskOutput } from '@application/dtos/task.output';

export class CreateTaskInput {
  constructor(
    public readonly title: string,
    public readonly description: string,
  ) {}
}

@Injectable()
export class CreateTaskUseCase {
  constructor(@Inject(TASK_REPOSITORY) private taskRepo: TaskRepository) {}

  async execute(input: CreateTaskInput): Promise<TaskOutput> {
    const task = Task.create(input.title, input.description);
    await this.taskRepo.save(task);
    return TaskOutput.fromDomain(task);
  }
}
