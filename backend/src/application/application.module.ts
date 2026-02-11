import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { RegisterUser } from './usecases/user/register-user';
import { AssignTaskUseCase } from './usecases/task/assign-task.usecase';
import { CompleteTaskUseCase } from './usecases/task/complete-task.usecase';
import { CreateTaskUseCase } from './usecases/task/create-task.usecase';
import { Signin } from './usecases/auth/signin';

@Module({
  imports: [InfrastructureModule],
  providers: [
    RegisterUser,
    Signin,
    AssignTaskUseCase,
    CompleteTaskUseCase,
    CreateTaskUseCase,
  ],
  exports: [
    RegisterUser,
    Signin,
    AssignTaskUseCase,
    CompleteTaskUseCase,
    CreateTaskUseCase,
  ],
})
export class ApplicationModule {}
