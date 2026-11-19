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
import { ChangePasswordDto } from './dto/change-password.dto';

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
    const user = await this.forward('get', `/auth/${id}`);
    const postsCount = await this.fetchPostsCount(id);
    return { ...user, postsCount };
  }

  private async fetchPostsCount(authorId: string): Promise<number> {
    const blogUrl = getGatewayConfig().services.blog;
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${blogUrl}/posts/count/${authorId}`),
      );
      return response.data.postsCount ?? 0;
    } catch {
      return 0;
    }
  }

  private async forward(
    method: 'get' | 'post' | 'patch' | 'delete',
    path: string,
    body?: unknown,
    userId?: string,
  ) {
    const baseUrl = getGatewayConfig().services.users;
    try {
      const response = await lastValueFrom(
        this.httpService.request({
          method,
          url: `${baseUrl}${path}`,
          data: body,
          headers: userId ? { 'X-User-Id': userId } : {},
        }),
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        throw new HttpException(
          axiosError.response.data as Record<string, unknown>,
          axiosError.response.status,
        );
      }
      throw new InternalServerErrorException('Сервис users недоступен');
    }
  }
  public async changePassword(userId: string, dto: ChangePasswordDto) {
    return this.forward('patch', '/auth/password', dto, userId);
  }
  public async subscribe(userId: string, followingId: string) {
    return this.forward(
      'post',
      `/auth/subscribe/${followingId}`,
      undefined,
      userId,
    );
  }

  public async unsubscribe(userId: string, followingId: string) {
    return this.forward(
      'delete',
      `/auth/subscribe/${followingId}`,
      undefined,
      userId,
    );
  }
}
