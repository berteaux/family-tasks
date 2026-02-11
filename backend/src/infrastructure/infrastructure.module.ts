import { Module } from '@nestjs/common';
import { USER_REPOSITORY } from '@domain/ports/user-repository';
import { TASK_REPOSITORY } from '@domain/ports/task-repository';
import { PrismaService } from './database/prisma.service';
import { PrismaUserRepository } from './persistance/prisma-user.repository';
import { PrismaTaskRepository } from './persistance/prisma-task.repository';
import { PASSWORD_HASHER } from '@domain/ports/password-hasher';
import { BcryptPasswordHasher } from './security/bcrypt-password-hasher';

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
    {
      provide: PASSWORD_HASHER,
      useClass: BcryptPasswordHasher,
    },
  ],
  exports: [USER_REPOSITORY, TASK_REPOSITORY, PASSWORD_HASHER],
})
export class InfrastructureModule {}
