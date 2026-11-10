import { Injectable } from '@nestjs/common';
import { LikeEntity } from './like.entity';

@Injectable()
export class LikeRepository {
  private readonly likes = new Map<string, LikeEntity>();

  public async save(entity: LikeEntity): Promise<LikeEntity> {
    this.likes.set(entity.key, entity);
    return entity;
  }

  public async delete(userId: string, postId: string): Promise<boolean> {
    return this.likes.delete(`${userId}|${postId}`);
  }

  public async exists(userId: string, postId: string): Promise<boolean> {
    return this.likes.has(`${userId}|${postId}`);
  }

  public async countByPost(postId: string): Promise<number> {
    return [...this.likes.values()].filter((l) => l.postId === postId).length;
  }

  public async deleteByPost(postId: string): Promise<void> {
    for (const [key, like] of this.likes) {
      if (like.postId === postId) {
        this.likes.delete(key);
      }
    }
  }
}