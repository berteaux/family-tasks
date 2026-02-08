import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { RegisterUser } from './usecases/register-user';

@Module({
  imports: [InfrastructureModule],
  providers: [RegisterUser],
  exports: [RegisterUser],
})
export class ApplicationModule {}
