import { Inject, Injectable } from '@nestjs/common';
import {
  TASK_REPOSITORY,
  type TaskRepository,
} from '@domain/ports/task-repository';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '@domain/ports/user-repository';
import { ForbiddenException } from '@domain/exceptions/forbidden.exception';
import { NotFoundException } from '@domain/exceptions/not-found.exception';

export class AssignTaskInput {
  constructor(
    public readonly taskId: string,
    public readonly userId: string,
    public readonly currentUserRole: 'MANAGER' | 'MEMBER',
  ) {}
}

@Injectable()
export class AssignTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY) private taskRepo: TaskRepository,
    @Inject(USER_REPOSITORY) private userRepo: UserRepository,
  ) {}

  async execute(input: AssignTaskInput): Promise<void> {
    if (input.currentUserRole !== 'MANAGER') {
      throw new ForbiddenException('Only managers can assign tasks');
    }

    const task = await this.taskRepo.findById(input.taskId);
    if (!task) throw new NotFoundException('Task not found');

    const user = await this.userRepo.findById(input.userId);
    if (!user) throw new NotFoundException('User not found');

    task.assignTo(input.userId);
    await this.taskRepo.save(task);
  }
}
