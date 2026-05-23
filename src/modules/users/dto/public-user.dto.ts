import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../../common/enums/role.enum';

export class PublicUserDto {
  @ApiProperty({ example: '6b6b7e55-46c8-4e61-8d22-35d4d9a3f0b3' })
  id!: string;

  @ApiProperty({ example: 'Usuário Demo' })
  name!: string;

  @ApiProperty({ example: 'demo@duolingo.local' })
  email!: string;

  @ApiPropertyOptional({ example: null, nullable: true })
  avatarUrl!: string | null;

  @ApiProperty({ example: 0 })
  xp!: number;

  @ApiProperty({ example: 1 })
  level!: number;

  @ApiProperty({ example: 0 })
  streak!: number;

  @ApiPropertyOptional({ example: null, nullable: true })
  lastStudyDate!: Date | null;

  @ApiProperty({ enum: Role, example: Role.USER })
  role!: Role;

  @ApiProperty({ example: '2026-05-22T12:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-05-22T12:00:00.000Z' })
  updatedAt!: Date;
}
