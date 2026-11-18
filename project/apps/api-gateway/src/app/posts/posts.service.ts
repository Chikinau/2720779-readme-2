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
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostsQueryDto } from './dto/get-posts-query.dto';

interface BlogPost {
  id: string;
  type: string;
  authorId: string;
  title?: string;
  tags: string[];
  publishDate: string;
  status: string;
  isRepost: boolean;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

@Injectable()
export class PostsService {
  constructor(private readonly httpService: HttpService) {}

  public async findMany(query: GetPostsQueryDto) {
    const blogUrl = getGatewayConfig().services.blog;
    const params = new URLSearchParams();
    if (query.authorId) params.set('authorId', query.authorId);
    if (query.type) params.set('type', query.type);
    if (query.tag) params.set('tag', query.tag);
    if (query.sort) params.set('sort', query.sort);
    if (query.page) params.set('page', String(query.page));
    if (query.limit) params.set('limit', String(query.limit));

    const response = await this.request<{ items: BlogPost[]; total: number }>(
      'get',
      `${blogUrl}/posts?${params.toString()}`,
    );

    const enriched = await this.enrichPosts(response.items);
    return { items: enriched, total: response.total };
  }

  public async findById(id: string) {
    const blogUrl = getGatewayConfig().services.blog;
    const post = await this.request<BlogPost>('get', `${blogUrl}/posts/${id}`);
    const [enriched] = await this.enrichPosts([post]);
    return enriched;
  }

  public async create(dto: CreatePostDto, authorId: string) {
    const blogUrl = getGatewayConfig().services.blog;
    return this.request('post', `${blogUrl}/posts`, { ...dto, authorId });
  }

  public async update(id: string, dto: Partial<CreatePostDto>) {
    const blogUrl = getGatewayConfig().services.blog;
    return this.request('patch', `${blogUrl}/posts/${id}`, dto);
  }

  public async delete(id: string) {
    const blogUrl = getGatewayConfig().services.blog;
    return this.request('delete', `${blogUrl}/posts/${id}`);
  }

  public async repost(id: string, authorId: string) {
    const blogUrl = getGatewayConfig().services.blog;
    return this.request('post', `${blogUrl}/posts/${id}/repost`, { authorId });
  }

  public async findDrafts(authorId: string) {
    const blogUrl = getGatewayConfig().services.blog;
    const response = await this.request<{ items: BlogPost[]; total: number }>(
      'get',
      `${blogUrl}/posts/drafts?authorId=${authorId}`,
    );
    const enriched = await this.enrichPosts(response.items);
    return { items: enriched, total: response.total };
  }

  public async search(title: string) {
    const blogUrl = getGatewayConfig().services.blog;
    const response = await this.request<{ items: BlogPost[]; total: number }>(
      'get',
      `${blogUrl}/posts/search?title=${encodeURIComponent(title)}`,
    );
    const enriched = await this.enrichPosts(response.items);
    return { items: enriched, total: response.total };
  }

  private async enrichPosts(posts: BlogPost[]) {
    if (posts.length === 0) {
      return [];
    }

    const authorIds = [...new Set(posts.map((p) => p.authorId))];
    const usersUrl = getGatewayConfig().services.users;

    const authors = await Promise.all(
      authorIds.map(async (id) => {
        try {
          const user = await this.request<UserProfile>(
            'get',
            `${usersUrl}/auth/${id}`,
          );
          return user;
        } catch {
          return { id, name: 'Неизвестный автор', email: '' };
        }
      }),
    );

    const authorMap = new Map(authors.map((a) => [a.id, a]));

    return posts.map((post) => {
      const author = authorMap.get(post.authorId) ?? {
        id: post.authorId,
        name: 'Неизвестный автор',
        email: '',
      };
      return {
        id: post.id,
        type: post.type,
        title: post.title,
        tags: post.tags,
        publishDate: post.publishDate,
        status: post.status,
        isRepost: post.isRepost,
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
