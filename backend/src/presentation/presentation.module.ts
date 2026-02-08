// presentation/presentation.module.ts
import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { UsersController } from './controllers/users.controller';
import { ApplicationModule } from '../application/application.module';

@Module({
  imports: [ApplicationModule, InfrastructureModule],
  controllers: [UsersController],
})
export class PresentationModule {}
