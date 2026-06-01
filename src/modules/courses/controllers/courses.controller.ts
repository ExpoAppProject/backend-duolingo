import { Body, Controller, Get, Param, Post, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CoursesService } from '../services/courses.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { ResponseMessage } from '../../../common/decorators/response-message.decorator';
import { CourseListItemDto } from '../dto/course-list-item.dto';
import { StartCourseResponseDto } from '../dto/start-course-response.dto';
import { GetTrackForUserResponseDto } from '../dto/get-track-for-user-response.dto';
import { CompleteLessonResponseDto } from '../dto/complete-lesson-response.dto';
import { CourseDetailResponseDto } from '../dto/course-detail-response.dto';
import { LessonResponseDto } from '../dto/lesson-response.dto';
import { CompleteLessonDto } from '../dto/complete-lesson.dto';
import { CourseProgressResponseDto } from '../dto/course-progress-response.dto';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @ApiOkResponse({ type: CourseListItemDto, isArray: true })
  async findAll() {
    return this.coursesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/lessons/:id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID da licao' })
  @ApiOkResponse({ type: LessonResponseDto })
  async getLesson(@Param('id') id: string, @CurrentUser() user: User) {
    if (!user || !user.id) throw new BadRequestException('User required');
    return this.coursesService.getLessonForUser(user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/lessons/:id/complete')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID da licao' })
  @ApiOkResponse({ type: CompleteLessonResponseDto })
  @ResponseMessage('Lesson completed')
  async completeLesson(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() dto: CompleteLessonDto,
  ) {
    if (!user || !user.id) throw new BadRequestException('User required');
    return this.coursesService.completeLesson(user.id, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/start')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID do curso' })
  @ApiOkResponse({ type: StartCourseResponseDto })
  @ResponseMessage('Course started')
  async startCourse(@Param('id') id: string, @CurrentUser() user: User) {
    if (!user || !user.id) throw new BadRequestException('User required');
    return this.coursesService.startCourse(user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/progress')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID do curso' })
  @ApiOkResponse({ type: CourseProgressResponseDto })
  async getProgress(@Param('id') id: string, @CurrentUser() user: User) {
    if (!user || !user.id) throw new BadRequestException('User required');
    return this.coursesService.getProgressForCourse(user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID do curso' })
  @ApiOkResponse({ type: CourseDetailResponseDto })
  async getCourseDetail(@Param('id') id: string, @CurrentUser() user: User) {
    if (!user || !user.id) throw new BadRequestException('User required');
    return this.coursesService.getCourseDetailForUser(user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':courseId/tracks/:trackId')
  @ApiBearerAuth()
  @ApiParam({ name: 'courseId', description: 'ID do curso' })
  @ApiParam({ name: 'trackId', description: 'ID da trilha' })
  @ApiOkResponse({ type: GetTrackForUserResponseDto })
  async getTrack(
    @Param('courseId') courseId: string,
    @Param('trackId') trackId: string,
    @CurrentUser() user: User,
  ) {
    if (!user || !user.id) throw new BadRequestException('User required');
    return this.coursesService.getTrackForUser(user.id, courseId, trackId);
  }
}
