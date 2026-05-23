import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CoursesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAllCourses() {
    return this.prisma.course.findMany({
      select: { id: true, title: true, description: true },
    });
  }

  findCourseById(courseId: string) {
    return this.prisma.course.findUnique({ where: { id: courseId } });
  }

  findCourseProgress(userId: string, courseId: string) {
    return this.prisma.courseProgress.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
  }

  createCourseProgress(data: { userId: string; courseId: string; currentTrackId: string | null }) {
    return this.prisma.courseProgress.create({ data });
  }

  findFirstTrackForCourse(courseId: string) {
    return this.prisma.track.findFirst({
      where: { courseId },
      orderBy: { createdAt: 'asc' },
    });
  }

  ensureUserTrackReleased(userId: string, trackId: string) {
    return this.prisma.userTrack.createMany({
      data: [{ userId, trackId }],
      skipDuplicates: true,
    });
  }

  findTrackInCourse(courseId: string, trackId: string) {
    return this.prisma.track.findFirst({
      where: { id: trackId, courseId },
      select: { id: true, title: true },
    });
  }

  findModulesWithLessonsByTrack(trackId: string) {
    return this.prisma.module.findMany({
      where: { trackId },
      orderBy: { order: 'asc' },
      include: { lessons: { orderBy: { order: 'asc' } } },
    });
  }

  findLessonProgressesForLessons(userId: string, lessonIds: string[]) {
    return this.prisma.lessonProgress.findMany({
      where: { userId, lessonId: { in: lessonIds } },
    });
  }

  findLessonWithModule(lessonId: string) {
    return this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: true },
    });
  }

  findPreviousLessonInModule(moduleId: string, order: number) {
    return this.prisma.lesson.findFirst({
      where: { moduleId, order: { lt: order } },
      orderBy: { order: 'desc' },
    });
  }

  upsertLessonProgressCompleted(data: { userId: string; lessonId: string; completedAt: Date }) {
    return this.prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId: data.userId, lessonId: data.lessonId } },
      update: { completed: true, completedAt: data.completedAt },
      create: {
        userId: data.userId,
        lessonId: data.lessonId,
        completed: true,
        completedAt: data.completedAt,
      },
    });
  }

  findModuleWithTrack(moduleId: string) {
    return this.prisma.module.findUnique({
      where: { id: moduleId },
      include: { track: true },
    });
  }

  findLessonsInModule(moduleId: string) {
    return this.prisma.lesson.findMany({
      where: { moduleId },
      orderBy: { order: 'asc' },
    });
  }

  findModulesWithLessonsInTrack(trackId: string) {
    return this.prisma.module.findMany({
      where: { trackId },
      orderBy: { order: 'asc' },
      include: { lessons: { orderBy: { order: 'asc' } } },
    });
  }

  findNextTrackInCourse(courseId: string, afterCreatedAt: Date) {
    return this.prisma.track.findFirst({
      where: { courseId, createdAt: { gt: afterCreatedAt } },
      orderBy: { createdAt: 'asc' },
    });
  }

  updateCourseProgressCurrentTrack(userId: string, courseId: string, trackId: string) {
    return this.prisma.courseProgress.updateMany({
      where: { userId, courseId },
      data: { currentTrackId: trackId },
    });
  }
}
