import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { RefreshDto } from '../dto/refresh.dto';
import { ResponseMessage } from '../../../common/decorators/response-message.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOkResponse({
    description: 'Cria o usuário e retorna user + access/refresh tokens',
  })
  @ResponseMessage('Registered')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOkResponse({ description: 'Autentica e retorna user + access/refresh tokens' })
  @ResponseMessage('Logged in')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @ApiOkResponse({ description: 'Gera novos tokens a partir do refresh token' })
  @ResponseMessage('Token refreshed')
  refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto);
  }
}
