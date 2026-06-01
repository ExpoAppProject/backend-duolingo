import { ApiProperty } from '@nestjs/swagger';

export class XPResponseDto {
  @ApiProperty({ example: 120 })
  totalXP!: number;

  @ApiProperty({ example: 2 })
  level!: number;

  @ApiProperty({ example: 80 })
  xpToNextLevel!: number;

  @ApiProperty({ example: 20 })
  xpInCurrentLevel!: number;
}

export class StreakResponseDto {
  @ApiProperty({ example: 3 })
  currentStreak!: number;

  @ApiProperty({ example: 7 })
  longestStreak!: number;

  @ApiProperty({ example: '2026-05-26' })
  lastActiveDate!: string;
}
