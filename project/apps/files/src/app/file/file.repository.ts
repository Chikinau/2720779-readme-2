import { Injectable } from '@nestjs/common';
import { FileEntity } from './file.entity';

@Injectable()
export class FileRepository {
  private readonly files = new Map<string, FileEntity>();

  public async save(entity: FileEntity): Promise<FileEntity> {
    this.files.set(entity.id, entity);
    return entity;
  }

  public async findById(id: string): Promise<FileEntity | null> {
    return this.files.get(id) ?? null;
  }
}