import { BadRequestException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CoursesRepository } from '../repositories/courses.repository';
import { LESSON_COMPLETED_EVENT, LessonCompletedEvent } from '../events/lesson-completed.event';
import { CompleteLessonDto } from '../dto/complete-lesson.dto';
import type { TrackLessonDto, TrackModuleDto } from '../dto/get-track-for-user-response.dto';

@Injectable()
export class CoursesService {
  constructor(
    private readonly coursesRepository: CoursesRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findAll() {
    const courses = await this.coursesRepository.findAllCourses();
    return courses.map((course) => {
      const modules = course.tracks.flatMap((track) => track.modules);
      const lessons = modules.flatMap((module) => module.lessons);

      return {
        id: course.id,
        name: course.title,
        title: course.title,
        description: course.description ?? '',
        icon: course.id.includes('aws') ? 'cloud' : 'mobile',
        totalModules: modules.length,
        totalLessons: lessons.length,
      };
    });
  }

  async startCourse(userId: string, courseId: string) {
    const course = await this.coursesRepository.findCourseById(courseId);
    if (!course) throw new BadRequestException('Course not found');

    const existing = await this.coursesRepository.findCourseProgress(userId, courseId);
    if (existing) return existing;

    const firstTrack = await this.coursesRepository.findFirstTrackForCourse(courseId);

    const progress = await this.coursesRepository.createCourseProgress({
      userId,
      courseId,
      currentTrackId: firstTrack ? firstTrack.id : null,
    });

    if (firstTrack) {
      await this.coursesRepository.ensureUserTrackReleased(userId, firstTrack.id);
    }

    return progress;
  }

  async getCourseDetailForUser(userId: string, courseId: string) {
    const course = await this.coursesRepository.findCourseById(courseId);
    if (!course) throw new BadRequestException('Course not found');

    const progress = await this.startCourse(userId, courseId);
    const trackId = progress.currentTrackId ?? course.tracks[0]?.id;
    const allModules = course.tracks.flatMap((track) => track.modules);
    const allLessons = allModules.flatMap((module) => module.lessons);

    if (!trackId) {
      return this.mapCourseDetail(course, [], allModules.length, allLessons.length);
    }

    const track = await this.getTrackForUser(userId, courseId, trackId);
    const modules = track.modules.map((module) => {
      const sourceModule = allModules.find((item) => item.id === module.id);

      return {
        id: module.id,
        courseId,
        name: module.title,
        description: module.title,
        order: sourceModule?.order ?? 0,
        isUnlocked: module.lessons.some((lesson) => !lesson.locked),
        isCompleted: module.lessons.length > 0 && module.lessons.every((lesson) => lesson.completed),
        lessons: module.lessons.map((lesson) => ({
          id: lesson.id,
          moduleId: module.id,
          title: lesson.title,
          order: lesson.order,
          isCompleted: lesson.completed,
          isUnlocked: !lesson.locked,
        })),
      };
    });

    return this.mapCourseDetail(course, modules, allModules.length, allLessons.length);
  }

  async getTrackForUser(userId: string, courseId: string, trackId: string) {
    const track = await this.coursesRepository.findTrackInCourse(courseId, trackId);
    if (!track) throw new BadRequestException('Track not found');

    const modules = await this.coursesRepository.findModulesWithLessonsByTrack(track.id);
    const lessonIds = modules.flatMap((m) => m.lessons.map((l) => l.id));
    const progresses = lessonIds.length
      ? await this.coursesRepository.findLessonProgressesForLessons(userId, lessonIds)
      : [];
    const completedSet = new Set(progresses.filter((p) => p.completed).map((p) => p.lessonId));

    const resultModules: TrackModuleDto[] = [];
    let previousCompleted = true;
    for (const mod of modules) {
      const modLessons: TrackLessonDto[] = mod.lessons.map((lesson) => {
        const completed = completedSet.has(lesson.id);
        const locked = !previousCompleted;
        previousCompleted = completed;
        return { id: lesson.id, title: lesson.title, order: lesson.order, completed, locked };
      });
      resultModules.push({ id: mod.id, title: mod.title, lessons: modLessons });
    }

    for (const m of resultModules) {
      for (const l of m.lessons) {
        if (!l.completed) {
          l.current = true;
          return { track: { id: track.id, title: track.title }, modules: resultModules };
        }
      }
    }

    return { track: { id: track.id, title: track.title }, modules: resultModules };
  }

  async getLessonForUser(userId: string, lessonId: string) {
    const lesson = await this.coursesRepository.findLessonWithExercises(lessonId);
    if (!lesson) throw new BadRequestException('Lesson not found');

    const prev = await this.coursesRepository.findPreviousLessonInModule(
      lesson.moduleId,
      lesson.order,
    );

    if (prev) {
      const prevProgress = await this.coursesRepository
        .findLessonProgressesForLessons(userId, [prev.id])
        .then((rows) => rows[0] ?? null);
      if (!prevProgress || !prevProgress.completed)
        throw new BadRequestException('Previous lesson not completed');
    }

    return {
      id: lesson.id,
      moduleId: lesson.moduleId,
      title: lesson.title,
      order: lesson.order,
      exercises: lesson.exercises.map((exercise) => ({
        id: exercise.id,
        lessonId: exercise.lessonId,
        type: 'multiple_choice' as const,
        question: exercise.question,
        options: Array.isArray(exercise.options) ? (exercise.options as unknown as string[]) : [],
        correctAnswerIndex: exercise.correctAnswerIndex,
      })),
    };
  }

  async getProgressForCourse(userId: string, courseId: string) {
    const course = await this.coursesRepository.findCourseProgressSummary(userId, courseId);
    if (!course) throw new BadRequestException('Course not found');

    const modules = course.tracks.flatMap((track) => track.modules);
    const lessons = modules.flatMap((module) => module.lessons);
    const completedProgresses = lessons
      .flatMap((lesson) => lesson.lessonProgresses)
      .filter((progress) => progress.completed);
    const firstIncomplete = lessons.find(
      (lesson) => !lesson.lessonProgresses.some((progress) => progress.completed),
    );
    const currentModule = modules.find((module) =>
      module.lessons.some((lesson) => lesson.id === firstIncomplete?.id),
    );
    const totalAnswers = completedProgresses.reduce(
      (sum, progress) => sum + progress.totalAnswers,
      0,
    );
    const correctAnswers = completedProgresses.reduce(
      (sum, progress) => sum + progress.correctAnswers,
      0,
    );

    return {
      userId,
      courseId,
      currentModuleId: currentModule?.id ?? modules[0]?.id ?? '',
      currentLessonId: firstIncomplete?.id ?? lessons[lessons.length - 1]?.id ?? '',
      completedLessons: completedProgresses.map((progress) => progress.lessonId),
      xpEarned: completedProgresses.reduce((sum, progress) => sum + progress.xpEarned, 0),
      accuracyRate: totalAnswers > 0 ? correctAnswers / totalAnswers : 0,
    };
  }

  async completeLesson(userId: string, lessonId: string, dto?: CompleteLessonDto) {
    const lesson = await this.coursesRepository.findLessonWithModule(lessonId);
    if (!lesson) throw new BadRequestException('Lesson not found');

    const prev = await this.coursesRepository.findPreviousLessonInModule(
      lesson.moduleId,
      lesson.order,
    );

    if (prev) {
      const prevProgress = await this.coursesRepository
        .findLessonProgressesForLessons(userId, [prev.id])
        .then((rows) => rows[0] ?? null);
      if (!prevProgress || !prevProgress.completed)
        throw new BadRequestException('Previous lesson not completed');
    }

    const correctAnswers = dto?.results?.filter((result) => result.isCorrect).length ?? 1;
    const totalAnswers = dto?.results?.length ?? 1;
    const accuracyRate = dto?.accuracyRate ?? correctAnswers / totalAnswers;
    const xpEarned = Math.max(5, Math.round(10 + correctAnswers * 5 + accuracyRate * 10));
    const completedAt = dto?.completedAt ? new Date(dto.completedAt) : new Date();

    await this.coursesRepository.upsertLessonProgressCompleted({
      userId,
      lessonId,
      completedAt,
      correctAnswers,
      totalAnswers,
      xpEarned,
      accuracyRate,
    });
    await this.coursesRepository.addUserXp(userId, xpEarned, completedAt);

    const event: LessonCompletedEvent = { userId, lessonId, completedAt };
    this.eventEmitter.emit(LESSON_COMPLETED_EVENT, event);

    const module = await this.coursesRepository.findModuleWithTrack(lesson.moduleId);
    if (!module) throw new BadRequestException('Module not found');
    const lessonsInModule = await this.coursesRepository.findLessonsInModule(module.id);
    const isLastInModule = lessonsInModule[lessonsInModule.length - 1].id === lesson.id;

    if (isLastInModule) {
      const modules = await this.coursesRepository.findModulesWithLessonsInTrack(module.trackId);
      const lastModule = modules[modules.length - 1];
      const lastLesson = lastModule.lessons[lastModule.lessons.length - 1];
      if (lastLesson.id === lesson.id) {
        const nextTrack = await this.coursesRepository.findNextTrackInCourse(
          module.track.courseId,
          module.track.createdAt,
        );
        if (nextTrack) {
          await this.coursesRepository.ensureUserTrackReleased(userId, nextTrack.id);
          await this.coursesRepository
            .updateCourseProgressCurrentTrack(userId, nextTrack.courseId, nextTrack.id)
            .catch(() => null);
        }
      }
    }

    return { success: true, xpEarned };
  }

  private mapCourseDetail(
    course: { id: string; title: string; description: string | null },
    modules: unknown[],
    totalModules: number,
    totalLessons: number,
  ) {
    return {
      id: course.id,
      name: course.title,
      description: course.description ?? '',
      icon: course.id.includes('aws') ? 'cloud' : 'mobile',
      totalModules,
      totalLessons,
      modules,
    };
  }
}
