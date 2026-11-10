import { Injectable } from '@nestjs/common';
import { Post } from '@project/shared-types';
import { PostRepository } from '../post/post.repository';

@Injectable()
export class SearchService {
  constructor(private readonly postRepository: PostRepository) {}

  public async searchByTitle(title: string): Promise<{ items: Post[]; total: number }> {
    const entities = await this.postRepository.findByTitle(title, 20);
    return {
      items: entities.map((e) => e.toPOJO()),
      total: entities.length,
    };
  }
}