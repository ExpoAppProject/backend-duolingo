import { ApiProperty } from '@nestjs/swagger';

export class CourseListItemDto {
  @ApiProperty({ example: 'course-expo' })
  id!: string;

  @ApiProperty({ example: 'Expo (React Native)' })
  title!: string;

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
}
