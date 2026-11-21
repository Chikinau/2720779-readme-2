import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

import { CurrentUser } from './current-user.decorator';
import { JwtAuthGuard } from './jwt-autg.guard';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiCreatedResponse({ description: 'Пользователь зарегистрирован' })
  public async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Вход, возвращает пару access + refresh токенов' })
  @ApiOkResponse({ description: 'Успешный вход' })
  @ApiUnauthorizedResponse({ description: 'Неверный пароль' })
  public async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Обновление пары токенов по refresh token' })
  @ApiOkResponse({ description: 'Новая пара токенов' })
  public async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Отзыв refresh token' })
  @ApiOkResponse({ description: 'Токен отозван' })
  public async logout(@Body() dto: RefreshTokenDto) {
    return this.authService.logout(dto.refreshToken);
  }

  @Patch('password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Смена пароля текущего пользователя' })
  @ApiOkResponse({ description: 'Пароль изменён' })
  @ApiUnauthorizedResponse({ description: 'Текущий пароль неверен' })
  public async changePassword(
    @Body() dto: ChangePasswordDto,
    @CurrentUser() userId: string,
  ) {
    return this.authService.changePassword(userId, dto);
  }
  @Post('subscribe/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Подписаться на пользователя' })
  @ApiOkResponse({ description: 'Подписка оформлена' })
  public async subscribe(
    @Param('id') followingId: string,
    @CurrentUser() userId: string,
  ) {
    return this.authService.subscribe(userId, followingId);
  }

  @Delete('subscribe/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Отписаться от пользователя' })
  @ApiOkResponse({ description: 'Подписка отменена' })
  public async unsubscribe(
    @Param('id') followingId: string,
    @CurrentUser() userId: string,
  ) {
    return this.authService.unsubscribe(userId, followingId);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Профиль текущего пользователя' })
  @ApiOkResponse({ description: 'Профиль пользователя' })
  @ApiUnauthorizedResponse({ description: 'Токен не передан или невалиден' })
  public async me(@CurrentUser() userId: string) {
    return this.authService.getUser(userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Детальная информация о пользователе (с агрегацией счётчиков)',
  })
  @ApiOkResponse({ description: 'Профиль пользователя' })
  @ApiNotFoundResponse({ description: 'Пользователь не найден' })
  public async getUser(@Param('id') id: string) {
    return this.authService.getUser(id);
  }
}
