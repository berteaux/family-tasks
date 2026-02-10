import { Module } from '@nestjs/common';
import { USER_REPOSITORY } from '@domain/ports/user-repository';
import { TASK_REPOSITORY } from '@domain/ports/task-repository';
import { PrismaService } from './database/prisma.service';
import { PrismaUserRepository } from './persistance/prisma-user.repository';
import { PrismaTaskRepository } from './persistance/prisma-task.repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    {
      provide: TASK_REPOSITORY,
      useClass: PrismaTaskRepository,
    },
  ],
  exports: [USER_REPOSITORY, TASK_REPOSITORY],
})
export class InfrastructureModule {}
