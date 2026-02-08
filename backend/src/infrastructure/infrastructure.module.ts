// ✅ infrastructure/infrastructure.module.ts
import { Module } from '@nestjs/common';
import { InMemoryUserRepository } from './persistance/InMemoryUserRepository';
import { USER_REPOSITORY } from '@domain/repositories/IUserRepository';

@Module({
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: InMemoryUserRepository,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class InfrastructureModule {}
