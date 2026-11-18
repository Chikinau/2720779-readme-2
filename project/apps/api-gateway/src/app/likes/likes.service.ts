import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { getGatewayConfig } from '../app.config';

@Injectable()
export class LikesService {
  constructor(private readonly httpService: HttpService) {}

  public async like(postId: string, userId: string) {
    const blogUrl = getGatewayConfig().services.blog;
    return this.request('post', `${blogUrl}/posts/${postId}/like`, { userId });
  }

  public async unlike(postId: string, userId: string) {
    const blogUrl = getGatewayConfig().services.blog;
    return this.request('delete', `${blogUrl}/posts/${postId}/like`, {
      userId,
    });
  }

  private async request<T>(
    method: string,
    url: string,
    data?: unknown,
  ): Promise<T> {
    try {
      const response = await lastValueFrom(
        this.httpService.request({ method, url, data }),
      );
      return response.data as T;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        const status = axiosError.response.status;
        const body = axiosError.response.data;

        if (status === 404) {
          throw new NotFoundException('Ресурс не найден');
        }

        throw new HttpException(body as Record<string, unknown>, status);
      }
      throw new InternalServerErrorException('Сервис недоступен');
    }
  }
}
