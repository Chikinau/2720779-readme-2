import { Entity } from './common.interface';

export interface File extends Entity {
  hashName: string;
  originalName: string;
  mimetype: string;
  path: string;
  size: number;
  createdAt: Date;
}