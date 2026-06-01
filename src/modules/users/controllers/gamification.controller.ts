import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { XPResponseDto, StreakResponseDto } from '../dto/gamification-response.dto';
import { UsersService } from '../services/users.service';

@ApiTags('gamification')
@Controller('gamification')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GamificationController {
  constructor(private readonly usersService: UsersService) {}

  @Get('xp')
  @ApiOkResponse({ type: XPResponseDto })
  getXP(@CurrentUser() user: User) {
    return this.usersService.getXP(user);
  }

  @Post('xp')
  @ApiOkResponse({ type: XPResponseDto })
  addXP(@CurrentUser() user: User) {
    return this.usersService.getXP(user);
  }

  @Get('streak')
  @ApiOkResponse({ type: StreakResponseDto })
  getStreak(@CurrentUser() user: User) {
    return this.usersService.getStreak(user);
  }

  @Post('streak')
  @ApiOkResponse({ type: StreakResponseDto })
  updateStreak(@CurrentUser() user: User) {
    return this.usersService.getStreak(user);
  }
}
