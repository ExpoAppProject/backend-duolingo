import { BadRequestException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CoursesRepository } from '../repositories/courses.repository';
import { LESSON_COMPLETED_EVENT, LessonCompletedEvent } from '../events/lesson-completed.event';
import type { TrackLessonDto, TrackModuleDto } from '../dto/get-track-for-user-response.dto';

@Injectable()
export class CoursesService {
  constructor(
    private readonly coursesRepository: CoursesRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findAll() {
    return this.coursesRepository.findAllCourses();
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

  async getTrackForUser(userId: string, courseId: string, trackId: string) {
    const track = await this.coursesRepository.findTrackInCourse(courseId, trackId);
    if (!track) throw new BadRequestException('Track not found');

    const modules = await this.coursesRepository.findModulesWithLessonsByTrack(track.id);

    // fetch user's lesson progress for lessons in this track
    const lessonIds = modules.flatMap((m) => m.lessons.map((l) => l.id));
    const progresses = lessonIds.length
      ? await this.coursesRepository.findLessonProgressesForLessons(userId, lessonIds)
      : [];
    const completedSet = new Set(progresses.filter((p) => p.completed).map((p) => p.lessonId));

    const resultModules: TrackModuleDto[] = [];
    let previousCompleted = true; // allow first lesson
    for (const mod of modules) {
      const modLessons: TrackLessonDto[] = mod.lessons.map((lesson) => {
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
    const lesson = await this.coursesRepository.findLessonWithModule(lessonId);
    if (!lesson) throw new BadRequestException('Lesson not found');

    // find previous lesson in module by order
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

    const completedAt = new Date();
    await this.coursesRepository.upsertLessonProgressCompleted({
      userId,
      lessonId,
      completedAt,
    });

    const event: LessonCompletedEvent = { userId, lessonId, completedAt };
    this.eventEmitter.emit(LESSON_COMPLETED_EVENT, event);

    // if this was last lesson of track, release next track
    const module = await this.coursesRepository.findModuleWithTrack(lesson.moduleId);
    if (!module) throw new BadRequestException('Module not found');
    const lessonsInModule = await this.coursesRepository.findLessonsInModule(module.id);
    const isLastInModule = lessonsInModule[lessonsInModule.length - 1].id === lesson.id;

    if (isLastInModule) {
      // check if this is the last lesson in the whole track
      const modules = await this.coursesRepository.findModulesWithLessonsInTrack(module.trackId);
      const lastModule = modules[modules.length - 1];
      const lastLesson = lastModule.lessons[lastModule.lessons.length - 1];
      if (lastLesson.id === lesson.id) {
        // release next track (by createdAt)
        const nextTrack = await this.coursesRepository.findNextTrackInCourse(
          module.track.courseId,
          module.track.createdAt,
        );
        if (nextTrack) {
          await this.coursesRepository.ensureUserTrackReleased(userId, nextTrack.id);
          // also update course progress currentTrackId if present
          await this.coursesRepository
            .updateCourseProgressCurrentTrack(userId, nextTrack.courseId, nextTrack.id)
            .catch(() => null);
        }
      }
    }

    return { success: true };
  }
}
