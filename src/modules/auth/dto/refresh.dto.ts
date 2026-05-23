import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class RefreshDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIuLi4iLCJlbWFpbCI6Ii4uLiIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE3MDAwNjA0MDB9.abc123',
    description: 'JWT refresh token retornado no login/register',
    minLength: 10,
  })
  @IsString()
  @MinLength(10)
  refreshToken!: string;
}
