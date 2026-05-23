import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'Gabriel Ribeiro',
    description: 'Nome de exibição do usuário',
    maxLength: 120,
  })
  @IsString()
  @MaxLength(120)
  name!: string;

  @ApiProperty({
    example: 'gabriel@exemplo.com',
    description: 'Email único do usuário',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Senha do usuário (mínimo 6 caracteres)',
    minLength: 6,
    maxLength: 64,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(64)
  password!: string;
}
