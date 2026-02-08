import { randomUUID } from 'crypto';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export class Task {
  private constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public status: TaskStatus,
    public assignedToUserId: string | null,
  ) {}

  static create(title: string, description: string): Task {
    if (!title.trim()) throw new Error('Title required');
    return new Task(randomUUID(), title, description, TaskStatus.TODO, null);
  }

  static reconstitute(
    id: string,
    title: string,
    description: string,
    status: TaskStatus,
    assignedToUserId: string | null,
  ): Task {
    return new Task(id, title, description, status, assignedToUserId);
  }

  assignTo(userId: string): void {
    if (this.assignedToUserId) throw new Error('Already assigned');
    this.assignedToUserId = userId;
    this.status = TaskStatus.IN_PROGRESS;
  }

  complete(): void {
    if (this.status === TaskStatus.DONE) throw new Error('Already done');
    if (!this.assignedToUserId) throw new Error('Must be assigned');
    this.status = TaskStatus.DONE;
  }

  isAssignedTo(userId: string): boolean {
    return this.assignedToUserId === userId;
  }

  getStatus(): TaskStatus {
    return this.status;
  }

  getAssignedUserId(): string | null {
    return this.assignedToUserId;
  }
}
