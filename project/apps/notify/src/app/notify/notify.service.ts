import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { NotifyStateRepository } from './notify-state.repository';

interface DigestPost {
  title: string;
  authorId: string;
}

@Injectable()
export class NotifyService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly stateRepository: NotifyStateRepository,
  ) {}

  public async sendDigest(
    recipientEmail: string,
    posts: DigestPost[] = [],
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: recipientEmail,
      subject: 'Новые публикации в Readme',
      template: 'notify-new-posts',
      context: {
        user: recipientEmail.split('@')[0],
        posts,
      },
    });
    await this.stateRepository.updateLastSentAt('digest', new Date());
  }
}
