import { Inject, Injectable } from '@nestjs/common';
import {
  TASK_REPOSITORY,
  type TaskRepository,
} from '@domain/ports/task-repository';
import { ForbiddenException } from '@domain/exceptions/forbidden.exception';
import { NotFoundException } from '@domain/exceptions/not-found.exception';

export class CompleteTaskInput {
  constructor(
    public readonly taskId: string,
    public readonly currentUserId: string,
    public readonly currentUserRole: 'MANAGER' | 'MEMBER',
  ) {}
}

@Injectable()
export class CompleteTaskUseCase {
  constructor(@Inject(TASK_REPOSITORY) private taskRepo: TaskRepository) {}

  async execute(input: CompleteTaskInput): Promise<void> {
    const task = await this.taskRepo.findById(input.taskId);
    if (!task) throw new NotFoundException('Task not found');

    const isAssignedUser = task.isAssignedTo(input.currentUserId);
    const isManager = input.currentUserRole === 'MANAGER';

    if (!isAssignedUser && !isManager) {
      throw new ForbiddenException(
        'Only the assigned user or a manager can complete this task',
      );
    }

    task.complete();
    await this.taskRepo.save(task);
  }
}
