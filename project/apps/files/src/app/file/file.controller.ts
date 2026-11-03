import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname, join } from 'node:path';
import { FileService } from './file.service';
import { randomUUID } from 'node:crypto';
import { FileRdo } from './rdo/file.rdo';
import { UPLOAD_DIR } from './file.consts';

@ApiTags('files')
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @ApiOkResponse({ description: 'Файл загружен', type: FileRdo })
  @ApiBadRequestResponse({ description: 'Неверный формат или размер' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: UPLOAD_DIR,
        filename: (_req, file, cb) => {
          const ext = extname(file.originalname);
          cb(null, `${randomUUID()}${ext}`);
        },
      }),
      limits: { fileSize: 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
          return cb(
            new BadRequestException('Допустимы только jpeg и png'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  public async upload(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.save(file);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Файл отдан' })
  public async getById(@Param('id') id: string, @Res() res: any) {
    const file = await this.fileService.getById(id);
    return res.sendFile(join(process.cwd(), file.path));
  }
}
