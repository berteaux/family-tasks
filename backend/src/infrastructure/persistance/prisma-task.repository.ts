import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from '@domain/entities/Task';
import { TaskRepository } from '@domain/ports/task-repository';
import { PrismaService } from '@infrastructure/database/prisma.service';
import {
  Task as PrismaTask,
  TaskStatus as PrismaTaskStatus,
} from '@prisma-generated/client';

@Injectable()
export class PrismaTaskRepository implements TaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(task: Task): Promise<void> {
    await this.prisma.task.upsert({
      where: { id: task.id },
      update: {
        title: task.title,
        description: task.description,
        status: this.mapStatusToPrisma(task.status),
        assignedToUserId: task.assignedToUserId,
      },
      create: {
        id: task.id,
        title: task.title,
        description: task.description,
        status: this.mapStatusToPrisma(task.status),
        assignedToUserId: task.assignedToUserId,
      },
    });
  }

  async findById(id: string): Promise<Task | null> {
    const prismaTask = await this.prisma.task.findUnique({
      where: { id },
    });

    return prismaTask ? this.toDomain(prismaTask) : null;
  }

  async findAll(): Promise<Task[]> {
    const prismaTasks = await this.prisma.task.findMany();
    return prismaTasks.map((t: PrismaTask) => this.toDomain(t));
  }

  async findByUserId(userId: string): Promise<Task[]> {
    const prismaTasks = await this.prisma.task.findMany({
      where: { assignedToUserId: userId },
    });
    return prismaTasks.map((t: PrismaTask) => this.toDomain(t));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.task.delete({
      where: { id },
    });
  }

  private toDomain(prismaTask: PrismaTask): Task {
    return Task.reconstitute(
      prismaTask.id,
      prismaTask.title,
      prismaTask.description,
      this.mapStatusToDomain(prismaTask.status),
      prismaTask.assignedToUserId,
    );
  }

  private mapStatusToDomain(status: PrismaTaskStatus): TaskStatus {
    const mapping: Record<PrismaTaskStatus, TaskStatus> = {
      TODO: TaskStatus.TODO,
      IN_PROGRESS: TaskStatus.IN_PROGRESS,
      DONE: TaskStatus.DONE,
    };
    return mapping[status];
  }

  private mapStatusToPrisma(status: TaskStatus): PrismaTaskStatus {
    const mapping: Record<TaskStatus, PrismaTaskStatus> = {
      [TaskStatus.TODO]: 'TODO',
      [TaskStatus.IN_PROGRESS]: 'IN_PROGRESS',
      [TaskStatus.DONE]: 'DONE',
    };
    return mapping[status];
  }
}
