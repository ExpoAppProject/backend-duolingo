import { ApiProperty } from '@nestjs/swagger';

export class CourseListItemDto {
  @ApiProperty({ example: '6b6b7e55-46c8-4e61-8d22-35d4d9a3f0b3' })
  id!: string;

  @ApiProperty({ example: 'Inglês' })
  title!: string;

  @ApiProperty({ example: 'Curso básico de inglês', required: false, nullable: true })
  description!: string | null;
}
