import { Injectable } from '@nestjs/common';
import { CommentEntity } from './comment.entity';

@Injectable()
export class CommentRepository {
  private readonly comments = new Map<string, CommentEntity>();

  public async save(entity: CommentEntity): Promise<CommentEntity> {
    this.comments.set(entity.id, entity);
    return entity;
  }

  public async findById(id: string): Promise<CommentEntity | null> {
    return this.comments.get(id) ?? null;
  }

  public async delete(id: string): Promise<boolean> {
    return this.comments.delete(id);
  }

  public async findByPost(
    postId: string,
    page = 1,
    limit = 50,
  ): Promise<{ items: CommentEntity[]; total: number }> {
    const filtered = [...this.comments.values()]
      .filter((c) => c.postId === postId)
      .sort((a, b) => b.createDate.getTime() - a.createDate.getTime());

    const total = filtered.length;
    const start = (page - 1) * limit;
    const items = filtered.slice(start, start + limit);

    return { items, total };
  }

  public async countByPost(postId: string): Promise<number> {
    return [...this.comments.values()].filter((c) => c.postId === postId)
      .length;
  }
}
