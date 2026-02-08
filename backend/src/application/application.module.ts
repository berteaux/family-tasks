import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { RegisterUser } from './usecases/user/register-user';
import { AssignTaskUseCase } from './usecases/task/assign-task.usecase';
import { CompleteTaskUseCase } from './usecases/task/complete-task.usecase';
import { CreateTaskUseCase } from './usecases/task/create-task.usecase';

@Module({
  imports: [InfrastructureModule],
  providers: [
    RegisterUser,
    AssignTaskUseCase,
    CompleteTaskUseCase,
    CreateTaskUseCase,
  ],
  exports: [
    RegisterUser,
    AssignTaskUseCase,
    CompleteTaskUseCase,
    CreateTaskUseCase,
  ],
})
export class ApplicationModule {}
