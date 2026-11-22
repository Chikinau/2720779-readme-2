import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UserRdo } from './rdo/user.rdo';
import { ParseMongoIdPipe } from './parse-mongo-id.pipe';
import { TokensRdo } from './rdo/tokens.rdo';
import { LoggedUserRdo } from './rdo/logged-user.rdo';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('authentication')
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('register')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiCreatedResponse({
    description: 'Пользователь зарегистрирован',
    type: UserRdo,
  })
  public async register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Вход, возвращает пару access + refresh токенов' })
  @ApiOkResponse({ description: 'Успешный вход', type: LoggedUserRdo })
  @ApiUnauthorizedResponse({ description: 'Неверный пароль' })
  @ApiNotFoundResponse({ description: 'Пользователь не найден' })
  public async login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Обновление пары токенов по refresh token' })
  @ApiOkResponse({ description: 'Новая пара токенов', type: TokensRdo })
  @ApiUnauthorizedResponse({
    description: 'Невалидный или отозванный refresh token',
  })
  public async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Отзыв refresh token' })
  @ApiOkResponse({ description: 'Токен отозван' })
  public async logout(@Body() dto: RefreshTokenDto) {
    await this.authService.logout(dto.refreshToken);
    return { success: true };
  }

  @Patch('password')
  @ApiOperation({ summary: 'Смена пароля текущего пользователя' })
  @ApiOkResponse({ description: 'Пароль изменён' })
  @ApiUnauthorizedResponse({ description: 'Текущий пароль неверен' })
  public async changePassword(
    @Body() dto: ChangePasswordDto,
    @Headers('x-user-id') userId: string,
  ) {
    await this.authService.changePassword(userId, dto);
    return { success: true };
  }

  @Get('following')
  @ApiOperation({
    summary: 'Список ID пользователей, на которых подписан текущий',
  })
  @ApiOkResponse({ description: 'Список ID' })
  public async following(@Headers('x-user-id') userId: string) {
    const ids = await this.authService.getFollowingIds(userId);
    return { followingIds: ids };
  }

  @Get('all-emails')
  @ApiOperation({ summary: 'Список email всех пользователей (внутренний)' })
  public async allEmails() {
    return { emails: await this.authService.getAllEmails() };
  }

  @Post('subscribe/:id')
  @ApiOperation({ summary: 'Подписаться на пользователя' })
  @ApiOkResponse({ description: 'Подписка оформлена' })
  @ApiConflictResponse({ description: 'Нельзя подписаться на себя' })
  @ApiNotFoundResponse({ description: 'Пользователь не найден' })
  public async subscribe(
    @Param('id', ParseMongoIdPipe) followingId: string,
    @Headers('x-user-id') followerId: string,
  ) {
    await this.authService.subscribe(followerId, followingId);
    return { success: true };
  }

  @Delete('subscribe/:id')
  @ApiOperation({ summary: 'Отписаться от пользователя' })
  @ApiOkResponse({ description: 'Подписка отменена' })
  public async unsubscribe(
    @Param('id', ParseMongoIdPipe) followingId: string,
    @Headers('x-user-id') followerId: string,
  ) {
    await this.authService.unsubscribe(followerId, followingId);
    return { success: true };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Детальная информация о пользователе' })
  @ApiOkResponse({ description: 'Профиль пользователя', type: UserRdo })
  @ApiNotFoundResponse({ description: 'Пользователь не найден' })
  public async getUser(@Param('id', ParseMongoIdPipe) id: string) {
    return this.authService.getUser(id);
  }
}
