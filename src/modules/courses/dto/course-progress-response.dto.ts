import { ApiProperty } from '@nestjs/swagger';

export class CourseProgressResponseDto {
  @ApiProperty({ example: 'user-id' })
  userId!: string;

  @ApiProperty({ example: 'course-expo' })
  courseId!: string;

  @ApiProperty({ example: 'expo-mod-1' })
  currentModuleId!: string;

  @ApiProperty({ example: 'expo-l1-2' })
  currentLessonId!: string;

  @ApiProperty({ example: ['expo-l1-1'], isArray: true })
  completedLessons!: string[];

  @ApiProperty({ example: 15 })
  xpEarned!: number;

  @ApiProperty({ example: 0.75 })
  accuracyRate!: number;
}
