import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { FilesService } from './files.service';
import 'multer';
@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @ApiOperation({ summary: 'Загрузить файл (проксируется в files-сервис)' })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ description: 'Файл загружен' })
  @UseInterceptors(FileInterceptor('file'))
  public async upload(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.upload(file);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить файл по id' })
  @ApiOkResponse({ description: 'Файл отдан' })
  public async getById(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ) {
    const stream = await this.filesService.getById(id);
    stream.pipe(res);
  }
}
