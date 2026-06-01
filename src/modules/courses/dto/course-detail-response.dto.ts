import { ApiProperty } from '@nestjs/swagger';

export class CourseDetailLessonDto {
  @ApiProperty({ example: 'expo-l1-1' })
  id!: string;

  @ApiProperty({ example: 'expo-mod-1' })
  moduleId!: string;

  @ApiProperty({ example: 'O que e Expo?' })
  title!: string;

  @ApiProperty({ example: 1 })
  order!: number;

  @ApiProperty({ example: false })
  isCompleted!: boolean;

  @ApiProperty({ example: true })
  isUnlocked!: boolean;
}

export class CourseDetailModuleDto {
  @ApiProperty({ example: 'expo-mod-1' })
  id!: string;

  @ApiProperty({ example: 'course-expo' })
  courseId!: string;

  @ApiProperty({ example: 'Fundamentos do Expo' })
  name!: string;

  @ApiProperty({ example: 'Configuracao e conceitos basicos' })
  description!: string;

  @ApiProperty({ example: 1 })
  order!: number;

  @ApiProperty({ example: true })
  isUnlocked!: boolean;

  @ApiProperty({ example: false })
  isCompleted!: boolean;

  @ApiProperty({ type: CourseDetailLessonDto, isArray: true })
  lessons!: CourseDetailLessonDto[];
}

export class CourseDetailResponseDto {
  @ApiProperty({ example: 'course-expo' })
  id!: string;

  @ApiProperty({ example: 'Expo (React Native)' })
  name!: string;

  @ApiProperty({ example: 'Aprenda a criar apps mobile com Expo e React Native' })
  description!: string;

  @ApiProperty({ example: 'mobile' })
  icon!: string;

  @ApiProperty({ example: 4 })
  totalModules!: number;

  @ApiProperty({ example: 10 })
  totalLessons!: number;

  @ApiProperty({ type: CourseDetailModuleDto, isArray: true })
  modules!: CourseDetailModuleDto[];
}
