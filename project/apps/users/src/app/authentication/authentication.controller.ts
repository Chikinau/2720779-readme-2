import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
import { LoggedUserRdo } from './rdo/logged-user.rdo';
import { UserRdo } from './rdo/user.rdo';

@ApiTags('authentication')
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('register')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiCreatedResponse({
    description: 'Пользователь успешно зарегистрирован (данные сохранены в MongoDB)',
    type: UserRdo,
  })
  @ApiConflictResponse({ description: 'Пользователь с таким email уже существует' })
  public async register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Вход в приложение, возвращает JWT' })
  @ApiOkResponse({
    description: 'Успешный вход, возвращается профиль и JWT',
    type: LoggedUserRdo,
  })
  @ApiUnauthorizedResponse({ description: 'Неверный пароль' })
  @ApiNotFoundResponse({ description: 'Пользователь не найден' })
  public async login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Детальная информация о пользователе (без конфиденциальных данных)' })
  @ApiOkResponse({
    description: 'Профиль пользователя (без passwordHash)',
    type: UserRdo,
  })
  @ApiNotFoundResponse({ description: 'Пользователь не найден' })
  public async getUser(@Param('id') id: string) {
    return this.authService.getUser(id);
  }
}