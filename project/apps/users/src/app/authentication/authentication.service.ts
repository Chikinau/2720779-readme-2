import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'node:crypto';
import { TokenPair, User, UserRole } from '@project/shared-types';
import { UserEntity } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';
import { RefreshTokenRepository } from '../refresh-token/refresh-token.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SubscriptionRepository } from '../subscription/subscription.repository';
import { getAppConfig } from '../app.config';

@Injectable()
export class AuthenticationService {
  private readonly jwtConfig = getAppConfig().jwt;
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly jwtService: JwtService,
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  public async register(dto: CreateUserDto): Promise<User> {
    if (await this.userRepository.exists(dto.email)) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const user = new UserEntity({
      id: '',
      email: dto.email,
      name: dto.name,
      role: UserRole.User,
      avatar: dto.avatar,
      createdAt: new Date(),
      passwordHash: '',
    });

    await user.setPassword(dto.password);
    const savedUser = await this.userRepository.save(user);
    return this.toPublic(savedUser);
  }

  public async login(dto: LoginUserDto) {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const isValid = await user.comparePassword(dto.password);
    if (!isValid) {
      throw new UnauthorizedException('Неверный пароль');
    }

    const tokens = await this.issueTokens(user);
    return { ...this.toPublic(user), ...tokens };
  }

  public async refresh(refreshToken: string): Promise<TokenPair> {
    let payload: { sub: string; jti: string };
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.jwtConfig.refreshSecret,
      });
    } catch {
      throw new UnauthorizedException('Невалидный refresh token');
    }

    const stored = await this.refreshTokenRepository.findByTokenId(payload.jti);
    if (!stored) {
      throw new UnauthorizedException('Refresh token отозван или не найден');
    }

    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    await this.refreshTokenRepository.deleteByTokenId(payload.jti);
    return this.issueTokens(user);
  }

  public async logout(refreshToken: string): Promise<void> {
    let payload: { jti: string };
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.jwtConfig.refreshSecret,
      });
    } catch {
      return;
    }
    await this.refreshTokenRepository.deleteByTokenId(payload.jti);
  }

  public async getUser(
    id: string,
  ): Promise<User & { subscribersCount: number }> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    const subscribersCount =
      await this.subscriptionRepository.countFollowers(id);
    return { ...this.toPublic(user), subscribersCount };
  }

  private async issueTokens(user: UserEntity): Promise<TokenPair> {
    const tokenId = randomUUID();
    const accessToken = await this.jwtService.signAsync(
      { sub: user.id, email: user.email, role: user.role },
      {
        secret: this.jwtConfig.accessSecret,
        expiresIn: this.jwtConfig.accessExpires,
      },
    );
    const refreshToken = await this.jwtService.signAsync(
      { sub: user.id, jti: tokenId },
      {
        secret: this.jwtConfig.refreshSecret,
        expiresIn: this.jwtConfig.refreshExpires,
      },
    );
    await this.refreshTokenRepository.create({
      tokenId,
      userId: user.id,
      expiresAt: new Date(Date.now() + this.jwtConfig.refreshTokenExpiresMs),
    });
    return { accessToken, refreshToken };
  }

  private toPublic(entity: UserEntity): User {
    const { passwordHash, ...rest } = entity.toPOJO();
    return rest;
  }
  public async changePassword(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const isValid = await user.comparePassword(dto.currentPassword);
    if (!isValid) {
      throw new UnauthorizedException('Текущий пароль неверен');
    }

    await user.setPassword(dto.newPassword);
    await this.userRepository.updatePassword(user.id, user.passwordHash);
  }
  public async subscribe(
    followerId: string,
    followingId: string,
  ): Promise<void> {
    if (followerId === followingId) {
      throw new ConflictException('Нельзя подписаться на самого себя');
    }
    const target = await this.userRepository.findById(followingId);
    if (!target) {
      throw new NotFoundException('Пользователь не найден');
    }
    await this.subscriptionRepository.subscribe(followerId, followingId);
  }

  public async unsubscribe(
    followerId: string,
    followingId: string,
  ): Promise<void> {
    await this.subscriptionRepository.unsubscribe(followerId, followingId);
  }

  public async getSubscribersCount(userId: string): Promise<number> {
    return this.subscriptionRepository.countFollowers(userId);
  }

  public async getFollowingIds(userId: string): Promise<string[]> {
    return this.subscriptionRepository.findFollowingIds(userId);
  }

  public async getAllEmails(): Promise<string[]> {
    return this.userRepository.findAllEmails();
  }
}
