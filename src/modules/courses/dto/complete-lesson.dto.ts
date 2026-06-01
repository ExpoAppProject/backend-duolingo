import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class ExerciseResultDto {
  @ApiProperty({ example: 'exercise-expo-l1-1-1' })
  @IsString()
  exerciseId!: string;

  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  selectedIndex!: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  isCorrect!: boolean;
}

export class CompleteLessonDto {
  @ApiProperty({ type: ExerciseResultDto, isArray: true })
  @IsArray()
  results!: ExerciseResultDto[];

  @ApiProperty({ example: 0.8 })
  @IsNumber()
  @Min(0)
  @Max(1)
  accuracyRate!: number;

  @ApiProperty({ example: '2026-05-26T12:00:00.000Z', required: false })
  @IsOptional()
  @IsString()
  completedAt?: string;
}
