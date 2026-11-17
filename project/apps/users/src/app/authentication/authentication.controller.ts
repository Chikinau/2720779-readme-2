import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
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

  @Get(':id')
  @ApiOperation({ summary: 'Детальная информация о пользователе' })
  @ApiOkResponse({ description: 'Профиль пользователя', type: UserRdo })
  @ApiNotFoundResponse({ description: 'Пользователь не найден' })
  public async getUser(@Param('id', ParseMongoIdPipe) id: string) {
    return this.authService.getUser(id);
  }
}
