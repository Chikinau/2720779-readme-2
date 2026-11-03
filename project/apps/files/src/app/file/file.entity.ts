import { File } from '@project/shared-types';

export class FileEntity implements File {
  public id!: string;
  public hashName!: string;
  public originalName!: string;
  public mimetype!: string;
  public path!: string;
  public size!: number;
  public createdAt!: Date;

  constructor(file: File) {
    this.populate(file);
  }

  public populate(data: File): void {
    this.id = data.id;
    this.hashName = data.hashName;
    this.originalName = data.originalName;
    this.mimetype = data.mimetype;
    this.path = data.path;
    this.size = data.size;
    this.createdAt = data.createdAt;
  }

  public toPOJO(): File {
    return {
      id: this.id,
      hashName: this.hashName,
      originalName: this.originalName,
      mimetype: this.mimetype,
      path: this.path,
      size: this.size,
      createdAt: this.createdAt,
    };
  }

  static fromObject(data: File): FileEntity {
    return new FileEntity(data);
  }
}