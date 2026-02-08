import { Module } from '@nestjs/common';
import { DomainModule } from '@domain/domain.module';
import { UsersController } from '@presentation/controllers/users.controller';

@Module({
  imports: [DomainModule],
  controllers: [UsersController],
  providers: [],
})
export class AppModule {}
