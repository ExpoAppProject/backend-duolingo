import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.course.findMany({ select: { id: true, title: true, description: true } });
  }

  async startCourse(userId: string, courseId: string) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new BadRequestException('Course not found');

    const existing = await this.prisma.courseProgress.findUnique({ where: { userId_courseId: { userId, courseId } } }).catch(() => null);
    if (existing) return existing;

    const firstTrack = await this.prisma.track.findFirst({ where: { courseId }, orderBy: { createdAt: 'asc' } });

    const progress = await this.prisma.courseProgress.create({
      data: {
        userId,
        courseId,
        currentTrackId: firstTrack ? firstTrack.id : null,
      },
    });

    if (firstTrack) {
      await this.prisma.userTrack.createMany({ data: [{ userId, trackId: firstTrack.id }], skipDuplicates: true });
    }

    return progress;
  }

  async getTrackForUser(userId: string, courseId: string, trackId: string) {
    const track = await this.prisma.track.findFirst({ where: { id: trackId, courseId } });
    if (!track) throw new BadRequestException('Track not found');

    const modules = await this.prisma.module.findMany({
      where: { trackId: track.id },
      orderBy: { order: 'asc' },
      include: { lessons: { orderBy: { order: 'asc' } } },
    });

    // fetch user's lesson progress for lessons in this track
    const lessonIds = modules.flatMap((m) => m.lessons.map((l) => l.id));
    const progresses = await this.prisma.lessonProgress.findMany({ where: { userId, lessonId: { in: lessonIds } } });
    const completedSet = new Set(progresses.filter((p) => p.completed).map((p) => p.lessonId));

    // Flatten lessons to determine sequential locking
    const flatLessons = modules.flatMap((m) => m.lessons.map((l) => ({ ...l, moduleId: m.id })) );

    const resultModules = [] as any[];
    let previousCompleted = true; // allow first lesson
    for (const mod of modules) {
      const modLessons = mod.lessons.map((lesson) => {
        const completed = completedSet.has(lesson.id);
        const locked = !previousCompleted;
        if (!completed) previousCompleted = false;
        else previousCompleted = true;
        return { id: lesson.id, title: lesson.title, order: lesson.order, completed, locked };
      });
      resultModules.push({ id: mod.id, title: mod.title, lessons: modLessons });
    }

    // mark current (first not completed)
    for (const m of resultModules) {
      for (const l of m.lessons) {
        if (!l.completed) {
          l.current = true;
          // stop after first
          return { track: { id: track.id, title: track.title }, modules: resultModules };
        }
      }
    }

    return { track: { id: track.id, title: track.title }, modules: resultModules };
  }

  async completeLesson(userId: string, lessonId: string) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId }, include: { module: true } });
    if (!lesson) throw new BadRequestException('Lesson not found');

    // find previous lesson in module by order
    const prev = await this.prisma.lesson.findFirst({
      where: { moduleId: lesson.moduleId, order: { lt: lesson.order } },
      orderBy: { order: 'desc' },
    });

    if (prev) {
      const prevProgress = await this.prisma.lessonProgress.findUnique({ where: { userId_lessonId: { userId, lessonId: prev.id } } }).catch(() => null);
      if (!prevProgress || !prevProgress.completed) throw new BadRequestException('Previous lesson not completed');
    }

    await this.prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: { completed: true, completedAt: new Date() },
      create: { userId, lessonId, completed: true, completedAt: new Date() },
    });

    // if this was last lesson of track, release next track
    const module = await this.prisma.module.findUnique({ where: { id: lesson.moduleId }, include: { track: true } });
    if (!module) throw new BadRequestException('Module not found');
    const lessonsInModule = await this.prisma.lesson.findMany({ where: { moduleId: module.id }, orderBy: { order: 'asc' } });
    const isLastInModule = lessonsInModule[lessonsInModule.length - 1].id === lesson.id;

    if (isLastInModule) {
      // check if this is the last lesson in the whole track
      const modules = await this.prisma.module.findMany({ where: { trackId: module.trackId }, orderBy: { order: 'asc' }, include: { lessons: { orderBy: { order: 'asc' } } } });
      const lastModule = modules[modules.length - 1];
      const lastLesson = lastModule.lessons[lastModule.lessons.length - 1];
      if (lastLesson.id === lesson.id) {
        // release next track (by createdAt)
        const nextTrack = await this.prisma.track.findFirst({ where: { courseId: module.track.courseId, createdAt: { gt: module.track.createdAt } }, orderBy: { createdAt: 'asc' } });
        if (nextTrack) {
          await this.prisma.userTrack.createMany({ data: [{ userId, trackId: nextTrack.id }], skipDuplicates: true });
          // also update course progress currentTrackId if present
          await this.prisma.courseProgress.updateMany({ where: { userId, courseId: nextTrack.courseId }, data: { currentTrackId: nextTrack.id } }).catch(() => null);
        }
      }
    }

    return { success: true };
  }
}
