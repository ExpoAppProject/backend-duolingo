import { ApiProperty } from '@nestjs/swagger';

export class CompleteLessonResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 25 })
  xpEarned!: number;
}
