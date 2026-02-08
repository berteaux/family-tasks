import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import {
  TASK_REPOSITORY,
  type TaskRepository,
} from '@domain/ports/task-repository';
import { CreateTaskUseCase } from '@application/usecases/task/create-task.usecase';
import { AssignTaskUseCase } from '@application/usecases/task/assign-task.usecase';
import { CompleteTaskUseCase } from '@application/usecases/task/complete-task.usecase';
import { TaskOutput } from '@application/dtos/task.output';
import { CreateTaskDto } from '@presentation/dtos/create-task.dto';
import { AssignTaskDto } from '@presentation/dtos/assign-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(
    @Inject(TASK_REPOSITORY) private readonly taskRepo: TaskRepository,
    private readonly createTask: CreateTaskUseCase,
    private readonly assignTask: AssignTaskUseCase,
    private readonly completeTask: CompleteTaskUseCase,
  ) {}

  @Get()
  async findAll(): Promise<TaskOutput[]> {
    const tasks = await this.taskRepo.findAll();
    return tasks.map((task) => TaskOutput.fromDomain(task));
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<TaskOutput | null> {
    const task = await this.taskRepo.findById(id);
    if (!task) return null;
    return TaskOutput.fromDomain(task);
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string): Promise<TaskOutput[]> {
    const tasks = await this.taskRepo.findByUserId(userId);
    return tasks.map((task) => TaskOutput.fromDomain(task));
  }

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateTaskDto): Promise<TaskOutput> {
    return this.createTask.execute({
      title: dto.title,
      description: dto.description,
    });
  }

  @Put(':id/assign')
  async assign(
    @Param('id') taskId: string,
    @Body() dto: AssignTaskDto,
  ): Promise<void> {
    await this.assignTask.execute({ taskId, userId: dto.userId });
  }

  @Put(':id/complete')
  async complete(
    @Param('id') taskId: string,
    @Body() dto: { userId: string },
  ): Promise<void> {
    await this.completeTask.execute({ taskId, userId: dto.userId });
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<void> {
    await this.taskRepo.delete(id);
  }
}
