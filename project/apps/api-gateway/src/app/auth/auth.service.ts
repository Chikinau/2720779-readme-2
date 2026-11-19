import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { getGatewayConfig } from '../app.config';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService) {}

  public async register(dto: RegisterDto) {
    return this.forward('post', '/auth/register', dto);
  }

  public async login(dto: LoginDto) {
    return this.forward('post', '/auth/login', dto);
  }

  public async refresh(refreshToken: string) {
    return this.forward('post', '/auth/refresh', { refreshToken });
  }

  public async logout(refreshToken: string) {
    return this.forward('post', '/auth/logout', { refreshToken });
  }

  public async getUser(id: string) {
    return this.forward('get', `/auth/${id}`);
  }

  private async forward(method: 'get' | 'post', path: string, body?: unknown) {
    const baseUrl = getGatewayConfig().services.users;
    try {
      const response = await lastValueFrom(
        this.httpService.request({
          method,
          url: `${baseUrl}${path}`,
          data: body,
        }),
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        const status = axiosError.response.status;
        const data = axiosError.response.data;
        throw new HttpException(data as Record<string, unknown>, status);
      }
      throw new InternalServerErrorException('Сервис users недоступен');
    }
  }
}
