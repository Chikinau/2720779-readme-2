import { Entity } from './common.interface';

export interface Comment extends Entity {
  postId: string;     
  userId: string;      
  text: string;        
  createDate: Date;    
}