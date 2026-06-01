import { ApiProperty } from '@nestjs/swagger';

export class ExerciseResponseDto {
  @ApiProperty({ example: 'exercise-expo-l1-1-1' })
  id!: string;

  @ApiProperty({ example: 'expo-l1-1' })
  lessonId!: string;

  @ApiProperty({ example: 'multiple_choice' })
  type!: 'multiple_choice';

  @ApiProperty({ example: 'O que e o Expo?' })
  question!: string;

  @ApiProperty({ example: ['Framework mobile', 'Banco de dados', 'Cloud provider'] })
  options!: string[];

  @ApiProperty({ example: 0 })
  correctAnswerIndex!: number;
}

export class LessonResponseDto {
  @ApiProperty({ example: 'expo-l1-1' })
  id!: string;

  @ApiProperty({ example: 'expo-mod-1' })
  moduleId!: string;

  @ApiProperty({ example: 'O que e Expo?' })
  title!: string;

  @ApiProperty({ example: 1 })
  order!: number;

  @ApiProperty({ type: ExerciseResponseDto, isArray: true })
  exercises!: ExerciseResponseDto[];
}
