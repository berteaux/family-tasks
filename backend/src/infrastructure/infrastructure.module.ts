import { Module } from '@nestjs/common';
import { InMemoryUserRepository } from './persistance/in-memory-user.repository';
import { USER_REPOSITORY } from '@domain/ports/user-repository';
import { TASK_REPOSITORY } from '@domain/ports/task-repository';
import { InMemoryTaskRepository } from './persistance/in-memory-task.repository';

@Module({
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: InMemoryUserRepository,
    },
    {
      provide: TASK_REPOSITORY,
      useClass: InMemoryTaskRepository,
    },
  ],
  exports: [USER_REPOSITORY, TASK_REPOSITORY],
})
export class InfrastructureModule {}
