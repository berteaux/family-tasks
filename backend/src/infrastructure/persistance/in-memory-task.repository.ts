import { Injectable } from '@nestjs/common';
import { Task } from '@domain/entities/Task';
import type { TaskRepository } from '@domain/ports/task-repository';

@Injectable()
export class InMemoryTaskRepository implements TaskRepository {
  private tasks: Task[] = [];

  async save(task: Task): Promise<void> {
    const index = this.tasks.findIndex((t) => t.id === task.id);
    if (index >= 0) {
      this.tasks[index] = task;
    } else {
      this.tasks.push(task);
    }
  }

  async findById(id: string): Promise<Task | null> {
    return this.tasks.find((t) => t.id === id) || null;
  }

  async findAll(): Promise<Task[]> {
    return this.tasks;
  }

  async findByUserId(userId: string): Promise<Task[]> {
    return this.tasks.filter((t) => t.getAssignedUserId() === userId);
  }

  async delete(id: string): Promise<void> {
    this.tasks = this.tasks.filter((t) => t.id !== id);
  }
}
