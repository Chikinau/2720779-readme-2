import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiCreatedResponse({
    description: 'Пользователь успешно зарегистрирован',
    type: UserRdo,
  })
  public async register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOkResponse({
    description: 'Успешный вход, возвращается JWT',
    type: LoggedUserRdo,
  })
  public async login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Детальная информация о пользователе',
    type: UserRdo,
  })
  public async getUser(@Param('id') id: string) {
    return this.authService.getUser(id);
  }
}