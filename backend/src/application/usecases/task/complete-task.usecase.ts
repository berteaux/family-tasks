import { Inject, Injectable } from '@nestjs/common';
import {
  TASK_REPOSITORY,
  type TaskRepository,
} from '@domain/ports/task-repository';

export class CompleteTaskInput {
  constructor(
    public readonly taskId: string,
    public readonly userId: string,
  ) {}
}

@Injectable()
export class CompleteTaskUseCase {
  constructor(@Inject(TASK_REPOSITORY) private taskRepo: TaskRepository) {}

  async execute(input: CompleteTaskInput): Promise<void> {
    const task = await this.taskRepo.findById(input.taskId);
    if (!task) throw new Error('Task not found');

    if (!task.isAssignedTo(input.userId)) {
      throw new Error('Task not assigned to this user');
    }

    task.complete();
    await this.taskRepo.save(task);
  }
}
