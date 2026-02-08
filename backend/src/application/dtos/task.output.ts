// 2-application/dtos/task.output.ts
import { Task, TaskStatus } from '@domain/entities/Task';

export class TaskOutput {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly status: TaskStatus,
    public readonly assignedToUserId: string | null,
  ) {}

  static fromDomain(task: Task): TaskOutput {
    return new TaskOutput(
      task.id,
      task.title,
      task.description,
      task.getStatus(),
      task.getAssignedUserId(),
    );
  }
}
