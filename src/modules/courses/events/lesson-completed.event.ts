export const LESSON_COMPLETED_EVENT = 'lesson.completed';

export interface LessonCompletedEvent {
  userId: string;
  lessonId: string;
  completedAt: Date;
}
