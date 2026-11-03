import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { FileEntity } from './file.entity';
import { FileRepository } from './file.repository';
import {
  AVATAR_MAX_SIZE,
  POST_PHOTO_MAX_SIZE,
} from './file.consts';

@Injectable()
export class FileService {
  constructor(private readonly fileRepository: FileRepository) {}

  public async save(
    file: Express.Multer.File,
    purpose?: 'avatar' | 'post',
  ) {
    if (!file) {
      throw new BadRequestException('Файл не передан');
    }

    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
      throw new BadRequestException('Допустимы только jpeg и png');
    }

    const limit = purpose === 'avatar' ? AVATAR_MAX_SIZE : POST_PHOTO_MAX_SIZE;
    if (file.size > limit) {
      throw new BadRequestException(
        `Максимальный размер файла: ${limit} байт`,
      );
    }

    const entity = new FileEntity({
      id: randomUUID(),
      hashName: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      path: file.path,
      size: file.size,
      createdAt: new Date(),
    });

    await this.fileRepository.save(entity);
    return entity.toPOJO();
  }

  public async getById(id: string) {
    const file = await this.fileRepository.findById(id);
    if (!file) {
      throw new NotFoundException(`Файл ${id} не найден`);
    }
    return file;
  }
}