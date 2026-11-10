import { Module } from '@nestjs/common';
import { FileRepository } from './file.repository';
import { FileService } from './file.service';
import { FileController } from './file.controller';

@Module({
  controllers: [FileController],
  providers: [FileRepository, FileService],
  exports: [FileRepository, FileService],
})
export class FileModule {}