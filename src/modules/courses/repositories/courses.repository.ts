import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CoursesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAllCourses() {
    return this.prisma.course.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        tracks: {
          include: {
            modules: {
              include: { lessons: true },
            },
          },
        },
      },
    });
  }

  findCourseById(courseId: string) {
    return this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        tracks: {
          orderBy: { createdAt: 'asc' },
          include: {
            modules: {
              orderBy: { order: 'asc' },
              include: { lessons: { orderBy: { order: 'asc' } } },
            },
          },
        },
      },
    });
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

  findLessonWithExercises(lessonId: string) {
    return this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        exercises: { orderBy: { order: 'asc' } },
      },
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

  upsertLessonProgressCompleted(data: {
    userId: string;
    lessonId: string;
    completedAt: Date;
    correctAnswers: number;
    totalAnswers: number;
    xpEarned: number;
    accuracyRate: number;
  }) {
    return this.prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId: data.userId, lessonId: data.lessonId } },
      update: {
        completed: true,
        completedAt: data.completedAt,
        correctAnswers: data.correctAnswers,
        totalAnswers: data.totalAnswers,
        xpEarned: data.xpEarned,
        accuracyRate: data.accuracyRate,
      },
      create: {
        userId: data.userId,
        lessonId: data.lessonId,
        completed: true,
        completedAt: data.completedAt,
        correctAnswers: data.correctAnswers,
        totalAnswers: data.totalAnswers,
        xpEarned: data.xpEarned,
        accuracyRate: data.accuracyRate,
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

  findCourseProgressSummary(userId: string, courseId: string) {
    return this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        tracks: {
          orderBy: { createdAt: 'asc' },
          include: {
            modules: {
              orderBy: { order: 'asc' },
              include: {
                lessons: {
                  orderBy: { order: 'asc' },
                  include: {
                    lessonProgresses: {
                      where: { userId },
                    },
                  },
                },
              },
            },
          },
        },
        courseProgresses: {
          where: { userId },
        },
      },
    });
  }

  addUserXp(userId: string, amount: number, studiedAt: Date) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });
      const totalXp = user.xp + amount;
      const newLevel = Math.floor(totalXp / 100) + 1;
      const lastStudyDate = user.lastStudyDate;
      const sameDay =
        lastStudyDate && lastStudyDate.toISOString().slice(0, 10) === studiedAt.toISOString().slice(0, 10);
      const streak = sameDay ? user.streak : user.streak + 1;

      return tx.user.update({
        where: { id: userId },
        data: {
          xp: totalXp,
          level: newLevel,
          streak,
          lastStudyDate: studiedAt,
        },
      });
    });
  }
}
