import { ApiProperty } from '@nestjs/swagger';

export class StartCourseResponseDto {
  @ApiProperty({ example: 'c7d1c6f1-1c8b-4bd3-9b63-4c5c8a2d5c1f' })
  id!: string;

  @ApiProperty({ example: 'user-uuid' })
  userId!: string;

  @ApiProperty({ example: 'course-uuid' })
  courseId!: string;

  @ApiProperty({ example: 'track-uuid', required: false, nullable: true })
  currentTrackId!: string | null;

  @ApiProperty({ example: '2026-05-22T12:00:00.000Z' })
  startedAt!: Date;
}
