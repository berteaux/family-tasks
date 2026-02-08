// ✅ domain/domain.module.ts
import { Module } from '@nestjs/common';
import { RegisterUser } from './usecases/RegisterUser';
import { GetUserById } from './usecases/GetUserById';
import { GetUserByEmail } from './usecases/GetUserByEmail';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { GetAllUsers } from './usecases/GetAllUsers';

@Module({
  imports: [InfrastructureModule],
  providers: [RegisterUser, GetUserById, GetUserByEmail, GetAllUsers],
  exports: [RegisterUser, GetUserById, GetUserByEmail, GetAllUsers],
})
export class DomainModule {}
