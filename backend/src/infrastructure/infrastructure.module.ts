import { Module } from '@nestjs/common';
import { USER_REPOSITORY } from '@domain/ports/user-repository';
import { TASK_REPOSITORY } from '@domain/ports/task-repository';
import { PrismaService } from './database/prisma.service';
import { PrismaUserRepository } from './persistance/prisma-user.repository';
import { PrismaTaskRepository } from './persistance/prisma-task.repository';
import { PASSWORD_HASHER } from '@domain/ports/password-hasher';
import { BcryptPasswordHasher } from './security/bcrypt-password-hasher';
import { TOKEN_GENERATOR } from '@domain/ports/token-generator';
import { JwtTokenGenerator } from './security/jwt-token-generator';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: Number(process.env.JWT_EXPIRES_IN_SECONDS) || 86400,
      },
    }),
  ],
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
    {
      provide: TOKEN_GENERATOR,
      useClass: JwtTokenGenerator,
    },
  ],
  exports: [USER_REPOSITORY, TASK_REPOSITORY, PASSWORD_HASHER, TOKEN_GENERATOR],
})
export class InfrastructureModule {}
