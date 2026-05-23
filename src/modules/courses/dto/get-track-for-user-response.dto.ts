import { ApiProperty } from '@nestjs/swagger';

export class TrackDto {
  @ApiProperty({ example: 'track-uuid' })
  id!: string;

  @ApiProperty({ example: 'Trilha 1' })
  title!: string;
}

export class TrackLessonDto {
  @ApiProperty({ example: 'lesson-uuid' })
  id!: string;

  @ApiProperty({ example: 'Saudações' })
  title!: string;

  @ApiProperty({ example: 1 })
  order!: number;

  @ApiProperty({ example: false })
  completed!: boolean;

  @ApiProperty({ example: false })
  locked!: boolean;

  @ApiProperty({ example: true, required: false })
  current?: boolean;
}

export class TrackModuleDto {
  @ApiProperty({ example: 'module-uuid' })
  id!: string;

  @ApiProperty({ example: 'Módulo 1' })
  title!: string;

  @ApiProperty({ type: TrackLessonDto, isArray: true })
  lessons!: TrackLessonDto[];
}

export class GetTrackForUserResponseDto {
  @ApiProperty({ type: TrackDto })
  track!: TrackDto;

  @ApiProperty({ type: TrackModuleDto, isArray: true })
  modules!: TrackModuleDto[];
}
