import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LikeEntity } from './like.entity';
import { LikeRepository } from './like.repository';
import { PostRepository } from '../post/post.repository';

@Injectable()
export class LikeService {
  constructor(
    private readonly likeRepository: LikeRepository,
    private readonly postRepository: PostRepository,
  ) {}

  public async like(userId: string, postId: string) {
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new NotFoundException(`Публикация ${postId} не найдена`);
    }

    if (await this.likeRepository.exists(userId, postId)) {
      throw new ConflictException('Вы уже поставили лайк этой публикации');
    }

    const like = new LikeEntity({
      userId,
      postId,
      createDate: new Date(),
    });

    await this.likeRepository.save(like);
    return like.toPOJO();
  }

  public async unlike(userId: string, postId: string): Promise<void> {
    const exists = await this.likeRepository.exists(userId, postId);
    if (!exists) {
      throw new NotFoundException('Лайк не найден');
    }
    await this.likeRepository.delete(userId, postId);
  }

  public async countByPost(postId: string): Promise<number> {
    return this.likeRepository.countByPost(postId);
  }
}
