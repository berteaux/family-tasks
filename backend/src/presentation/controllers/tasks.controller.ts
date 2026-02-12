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
  UseGuards,
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
import {
  JwtAuthGuard,
  type JwtPayload,
} from '@presentation/guards/jwt-auth.guard';
import { CurrentUser } from '@presentation/decorators/current-user.decorator';
import { RolesGuard } from '@presentation/guards/roles.guard';
import { Roles } from '@presentation/decorators/roles.decorator';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(
    @Inject(TASK_REPOSITORY) private readonly taskRepo: TaskRepository,
    private readonly createTask: CreateTaskUseCase,
    private readonly assignTask: AssignTaskUseCase,
    private readonly completeTask: CompleteTaskUseCase,
  ) {}

  @Get()
  @Roles('MEMBER', 'MANAGER')
  async findAll(): Promise<TaskOutput[]> {
    const tasks = await this.taskRepo.findAll();
    return tasks.map((task) => TaskOutput.fromDomain(task));
  }

  @Get(':id')
  @Roles('MEMBER', 'MANAGER')
  async findById(@Param('id') id: string): Promise<TaskOutput | null> {
    const task = await this.taskRepo.findById(id);
    if (!task) return null;
    return TaskOutput.fromDomain(task);
  }

  @Get('user/:userId')
  @Roles('MEMBER', 'MANAGER')
  async findByUserId(@Param('userId') userId: string): Promise<TaskOutput[]> {
    const tasks = await this.taskRepo.findByUserId(userId);
    return tasks.map((task) => TaskOutput.fromDomain(task));
  }

  @Post()
  @HttpCode(201)
  @Roles('MANAGER')
  async create(
    @Body() dto: CreateTaskDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<TaskOutput> {
    return this.createTask.execute({
      title: dto.title,
      description: dto.description,
      currentUserRole: user.role,
    });
  }

  @Put(':id/assign')
  @Roles('MANAGER')
  async assign(
    @Param('id') taskId: string,
    @Body() dto: AssignTaskDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<void> {
    await this.assignTask.execute({
      taskId,
      userId: dto.userId,
      currentUserRole: user.role,
    });
  }

  @Put(':id/complete')
  async complete(
    @Param('id') taskId: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<void> {
    await this.completeTask.execute({
      taskId,
      currentUserId: user.userId,
      currentUserRole: user.role,
    });
  }

  @Delete(':id')
  @HttpCode(204)
  @Roles('MANAGER')
  async delete(@Param('id') id: string): Promise<void> {
    await this.taskRepo.delete(id);
  }
}
