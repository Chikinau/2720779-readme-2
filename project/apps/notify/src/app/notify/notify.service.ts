import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { lastValueFrom } from 'rxjs';
import { getNotifyConfig } from '../app.config';
import { NotifyStateRepository } from './notify-state.repository';

interface BlogPost {
  id: string;
  title?: string;
  authorId: string;
  publishDate: string;
}

@Injectable()
export class NotifyService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly stateRepository: NotifyStateRepository,
    private readonly httpService: HttpService,
  ) {}

  public async sendDigest(recipientEmail: string): Promise<void> {
    const lastSentAt = await this.stateRepository.getLastSentAt('digest');
    const since = lastSentAt ?? new Date(0);

    const posts = await this.fetchNewPosts(since);

    await this.mailerService.sendMail({
      to: recipientEmail,
      subject: 'Новые публикации в Readme',
      template: 'notify-new-posts',
      context: {
        user: recipientEmail.split('@')[0],
        posts: posts.map((p) => ({
          title: p.title ?? 'Без названия',
          authorId: p.authorId,
        })),
      },
    });

    await this.stateRepository.updateLastSentAt('digest', new Date());
  }

  private async fetchNewPosts(since: Date): Promise<BlogPost[]> {
    const blogUrl = getNotifyConfig().blogUrl;
    try {
      const response = await lastValueFrom(
        this.httpService.get(
          `${blogUrl}/posts/new-since/${since.toISOString()}`,
        ),
      );
      return response.data.items ?? [];
    } catch {
      return [];
    }
  }
}
