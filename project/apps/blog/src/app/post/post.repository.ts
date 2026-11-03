import { Injectable } from '@nestjs/common';
import { PostStatus } from '@project/shared-types';
import { PostEntity } from './post.entity';

@Injectable()
export class PostRepository {
  private readonly posts = new Map<string, PostEntity>();

  public async save(entity: PostEntity): Promise<PostEntity> {
    this.posts.set(entity.id, entity);
    return entity;
  }

  public async findById(id: string): Promise<PostEntity | null> {
    return this.posts.get(id) ?? null;
  }

  public async delete(id: string): Promise<boolean> {
    return this.posts.delete(id);
  }
  public async findByFilter(filter: {
    authorId?: string;
    type?: string;
    tag?: string;
    status?: PostStatus;
  }): Promise<PostEntity[]> {
    let items = [...this.posts.values()];

    if (filter.status) {
      items = items.filter((p) => p.status === filter.status);
    }
    if (filter.authorId) {
      items = items.filter((p) => p.authorId === filter.authorId);
    }
    if (filter.type) {
      items = items.filter((p) => p.type === filter.type);
    }
    if (filter.tag) {
      items = items.filter((p) => p.tags.includes(filter.tag!));
    }

    return items;
  }
  public async findByAuthor(authorId: string): Promise<PostEntity[]> {
    return [...this.posts.values()].filter((p) => p.authorId === authorId);
  }

  public async findByTitle(query: string, limit = 20): Promise<PostEntity[]> {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    const matched = [...this.posts.values()].filter((p) => {
      if (p.status !== PostStatus.Published) return false;
      if (!p.title) return false;
      const titleLower = p.title.toLowerCase();
      return words.some((w) => titleLower.includes(w));
    });
    return matched.slice(0, limit);
  }
}
