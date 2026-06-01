import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { GamificationController } from './controllers/gamification.controller';
import { UsersRepository } from './repositories/users.repository';
import { UsersService } from './services/users.service';

@Module({
  controllers: [UsersController, GamificationController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
