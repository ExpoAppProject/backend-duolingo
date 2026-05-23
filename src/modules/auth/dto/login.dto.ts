import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'gabriel@exemplo.com',
    description: 'Email cadastrado',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Senha do usuário',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password!: string;
}
