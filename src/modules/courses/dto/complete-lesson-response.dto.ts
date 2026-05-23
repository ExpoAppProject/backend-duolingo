import { ApiProperty } from '@nestjs/swagger';

export class CompleteLessonResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;
}
