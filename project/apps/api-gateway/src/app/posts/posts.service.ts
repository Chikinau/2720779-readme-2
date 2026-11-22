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
  likesCount?: number;
  commentsCount?: number;
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

    const enrichedPosts = await this.enrichPosts(response.items);
    return { items: enrichedPosts, total: response.total };
  }

  public async findById(id: string) {
    const blogUrl = getGatewayConfig().services.blog;
    const post = await this.request<BlogPost>('get', `${blogUrl}/posts/${id}`);
    const [enrichedPosts] = await this.enrichPosts([post]);
    return enrichedPosts;
  }

  public async create(dto: CreatePostDto, authorId: string) {
    const blogUrl = getGatewayConfig().services.blog;
    return this.request('post', `${blogUrl}/posts`, { ...dto, authorId });
  }

  public async update(id: string, dto: Partial<CreatePostDto>, userId: string) {
    const blogUrl = getGatewayConfig().services.blog;
    return this.request('patch', `${blogUrl}/posts/${id}`, dto, userId);
  }

  public async delete(id: string, userId: string) {
    const blogUrl = getGatewayConfig().services.blog;
    return this.request('delete', `${blogUrl}/posts/${id}`, undefined, userId);
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
    const enrichedPosts = await this.enrichPosts(response.items);
    return { items: enrichedPosts, total: response.total };
  }

  public async search(title: string) {
    const blogUrl = getGatewayConfig().services.blog;
    const response = await this.request<{ items: BlogPost[]; total: number }>(
      'get',
      `${blogUrl}/posts/search?title=${encodeURIComponent(title)}`,
    );
    const enrichedPosts = await this.enrichPosts(response.items);
    return { items: enrichedPosts, total: response.total };
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
        likesCount: post.likesCount ?? 0, // <-- добавили
        commentsCount: post.commentsCount ?? 0, // <-- добавили
        author: { id: author.id, name: author.name, email: author.email },
      };
    });
  }

  private async request<T>(
    method: string,
    url: string,
    data?: unknown,
    userId?: string,
  ): Promise<T> {
    try {
      const response = await lastValueFrom(
        this.httpService.request({
          method,
          url,
          data,
          headers: userId ? { 'X-User-Id': userId } : {},
        }),
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
  public async feed(userId: string, query: GetPostsQueryDto) {
    const usersUrl = getGatewayConfig().services.users;

    let followingIds: string[] = [];
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${usersUrl}/auth/following`, {
          headers: { 'X-User-Id': userId },
        }),
      );
      followingIds = response.data.followingIds ?? [];
    } catch {
      followingIds = [];
    }

    const authorIds = [...new Set([userId, ...followingIds])];

    const blogUrl = getGatewayConfig().services.blog;
    const params = new URLSearchParams();
    authorIds.forEach((id) => params.append('authorIds', id));
    if (query.sort) params.set('sort', query.sort);
    if (query.page) params.set('page', String(query.page));
    if (query.limit) params.set('limit', String(query.limit));

    const response = await this.request<{ items: BlogPost[]; total: number }>(
      'get',
      `${blogUrl}/posts?${params.toString()}`,
    );

    const enrichedPosts = await this.enrichPosts(response.items);
    return { items: enrichedPosts, total: response.total };
  }
}
