import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { CoursesService } from '../services/courses.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async findAll() {
    return this.coursesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/start')
  async startCourse(@Param('id') id: string, @CurrentUser() user: any) {
    if (!user || !user.id) throw new BadRequestException('User required');
    return this.coursesService.startCourse(user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':courseId/tracks/:trackId')
  async getTrack(
    @Param('courseId') courseId: string,
    @Param('trackId') trackId: string,
    @CurrentUser() user: any,
  ) {
    if (!user || !user.id) throw new BadRequestException('User required');
    return this.coursesService.getTrackForUser(user.id, courseId, trackId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/lessons/:id/complete')
  async completeLesson(@Param('id') id: string, @CurrentUser() user: any) {
    if (!user || !user.id) throw new BadRequestException('User required');
    return this.coursesService.completeLesson(user.id, id);
  }
}
