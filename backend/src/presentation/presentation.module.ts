// presentation/presentation.module.ts
import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { UsersController } from './controllers/users.controller';
import { ApplicationModule } from '../application/application.module';
import { TasksController } from './controllers/tasks.controller';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [ApplicationModule, InfrastructureModule],
  controllers: [UsersController, TasksController, AuthController],
})
export class PresentationModule {}
