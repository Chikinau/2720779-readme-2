import { Entity } from './common.interface';

export enum PostType {
  Video = 'video',
  Text = 'text',
  Quote = 'quote',
  Photo = 'photo',
  Link = 'link',
}

export enum PostStatus {
  Published = 'published',
  Draft = 'draft',
}

export interface Post extends Entity {
  type: PostType;
  authorId: string;
  title?: string;          
  tags: string[];          
  announcement?: string;    
  text?: string;            
  quoteText?: string;       
  quoteAuthor?: string;    
  videoUrl?: string;        
  photoUrl?: string;        
  linkUrl?: string;         
  linkDescription?: string; 
  publishDate: Date;        
  createDate: Date;         
  status: PostStatus;     
  isRepost: boolean;
  originalPostId?: string; 
  originalAuthorId?: string; 
}