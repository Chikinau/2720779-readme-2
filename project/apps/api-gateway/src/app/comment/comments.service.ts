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
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetCommentsQueryDto } from './dto/get-comments-query.dto';

interface BlogComment {
  id: string;
  postId: string;
  userId: string;
  text: string;
  createDate: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

@Injectable()
export class CommentsService {
  constructor(private readonly httpService: HttpService) {}

  public async create(postId: string, userId: string, dto: CreateCommentDto) {
    const blogUrl = getGatewayConfig().services.blog;
    return this.request('post', `${blogUrl}/posts/${postId}/comments`, {
      userId,
      text: dto.text,
    });
  }

  public async findByPost(postId: string, query: GetCommentsQueryDto) {
    const blogUrl = getGatewayConfig().services.blog;
    const params = new URLSearchParams();
    if (query.page) params.set('page', String(query.page));
    if (query.limit) params.set('limit', String(query.limit));

    const response = await this.request<{
      items: BlogComment[];
      total: number;
    }>('get', `${blogUrl}/posts/${postId}/comments?${params.toString()}`);

    const enriched = await this.enrich(response.items);
    return { items: enriched, total: response.total };
  }

  public async delete(id: string, userId: string) {
    const blogUrl = getGatewayConfig().services.blog;
    return this.request('delete', `${blogUrl}/comments/${id}`, { userId });
  }

  private async enrich(comments: BlogComment[]) {
    if (comments.length === 0) {
      return [];
    }
    const userIds = [...new Set(comments.map((c) => c.userId))];
    const usersUrl = getGatewayConfig().services.users;

    const authors = await Promise.all(
      userIds.map(async (id) => {
        try {
          return await this.request<UserProfile>(
            'get',
            `${usersUrl}/auth/${id}`,
          );
        } catch {
          return { id, name: 'Неизвестный автор', email: '' };
        }
      }),
    );
    const map = new Map(authors.map((a) => [a.id, a]));

    return comments.map((c) => {
      const author = map.get(c.userId) ?? {
        id: c.userId,
        name: 'Неизвестный автор',
        email: '',
      };
      return {
        id: c.id,
        postId: c.postId,
        text: c.text,
        createDate: c.createDate,
        author: { id: author.id, name: author.name, email: author.email },
      };
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
