import { ApiProperty } from '@nestjs/swagger';

export class FileRdo {
  @ApiProperty({ description: 'ID файла' })
  public id!: string;

  @ApiProperty({ description: 'Имя файла на диске' })
  public hashName!: string;

  @ApiProperty({ description: 'Оригинальное имя файла' })
  public originalName!: string;

  @ApiProperty({ description: 'MIME-тип' })
  public mimetype!: string;

  @ApiProperty({ description: 'Путь к файлу' })
  public path!: string;

  @ApiProperty({ description: 'Размер в байтах' })
  public size!: number;

  @ApiProperty({ description: 'Дата загрузки' })
  public createdAt!: Date;
}