import { Task } from '@domain/entities/Task';

export interface TaskRepository {
  save(task: Task): Promise<void>;
  findById(id: string): Promise<Task | null>;
  findAll(): Promise<Task[]>;
  findByUserId(userId: string): Promise<Task[]>;
  delete(id: string): Promise<void>;
}

export const TASK_REPOSITORY = Symbol('TASK_REPOSITORY');
