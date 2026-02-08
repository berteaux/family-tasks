import { Inject, Injectable } from '@nestjs/common';
import {
  TASK_REPOSITORY,
  type TaskRepository,
} from '@domain/ports/task-repository';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '@domain/ports/user-repository';

export class AssignTaskInput {
  constructor(
    public readonly taskId: string,
    public readonly userId: string,
  ) {}
}

@Injectable()
export class AssignTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY) private taskRepo: TaskRepository,
    @Inject(USER_REPOSITORY) private userRepo: UserRepository,
  ) {}

  async execute(input: AssignTaskInput): Promise<void> {
    const task = await this.taskRepo.findById(input.taskId);
    if (!task) throw new Error('Task not found');

    const user = await this.userRepo.findById(input.userId);
    if (!user) throw new Error('User not found');

    task.assignTo(input.userId);
    await this.taskRepo.save(task);
  }
}
