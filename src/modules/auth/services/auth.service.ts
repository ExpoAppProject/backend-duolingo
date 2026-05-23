import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { durationToMs } from '../../../common/utils/duration.util';
import { Role } from '../../../common/enums/role.enum';
import { UsersService } from '../../users/services/users.service';
import { AuthRepository } from '../repositories/auth.repository';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { RefreshDto } from '../dto/refresh.dto';

const DEFAULT_REFRESH_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.usersService.createUser({
      name: dto.name,
      email: dto.email,
      password: passwordHash,
      role: Role.USER,
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.usersService.toPublic(user),
      tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const validPassword = await bcrypt.compare(dto.password, user.password);
    if (!validPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.usersService.toPublic(user),
      tokens,
    };
  }

  async refresh(dto: RefreshDto) {
    const payload = await this.verifyRefreshToken(dto.refreshToken);
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const storedToken = await this.authRepository.findLatestActiveToken(user.id);
    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const matches = await bcrypt.compare(dto.refreshToken, storedToken.tokenHash);
    if (!matches) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.usersService.toPublic(user),
      tokens,
    };
  }

  private async generateTokens(userId: string, email: string, role: Role) {
    const payload: JwtPayload = { sub: userId, email, role };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d',
    });

    return { accessToken, refreshToken };
  }

  private async storeRefreshToken(userId: string, refreshToken: string) {
    const refreshExpiresIn = this.config.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d';
    const expiresAt = new Date(Date.now() + durationToMs(refreshExpiresIn, DEFAULT_REFRESH_MS));
    const tokenHash = await bcrypt.hash(refreshToken, 12);

    await this.authRepository.revokeUserTokens(userId);
    await this.authRepository.createRefreshToken({
      userId,
      tokenHash,
      expiresAt,
    });
  }

  private async verifyRefreshToken(token: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
