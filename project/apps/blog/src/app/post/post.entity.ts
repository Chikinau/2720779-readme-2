import { Post, PostStatus, PostType } from '@project/shared-types';

export class PostEntity implements Post {
  public id!: string;
  public type!: PostType;
  public authorId!: string;
  public title?: string;
  public tags!: string[];

  public announcement?: string;
  public text?: string;

  public quoteText?: string;
  public quoteAuthor?: string;

  public videoUrl?: string;

  public photoUrl?: string;

  public linkUrl?: string;
  public linkDescription?: string;

  public publishDate!: Date;
  public createDate!: Date;
  public status!: PostStatus;

  public isRepost!: boolean;
  public originalPostId?: string;
  public originalAuthorId?: string;

  constructor(post: Post) {
    this.populate(post);
  }

  public populate(data: Post): void {
    this.id = data.id;
    this.type = data.type;
    this.authorId = data.authorId;
    this.title = data.title;
    this.tags = data.tags;
    this.announcement = data.announcement;
    this.text = data.text;
    this.quoteText = data.quoteText;
    this.quoteAuthor = data.quoteAuthor;
    this.videoUrl = data.videoUrl;
    this.photoUrl = data.photoUrl;
    this.linkUrl = data.linkUrl;
    this.linkDescription = data.linkDescription;
    this.publishDate = data.publishDate;
    this.createDate = data.createDate;
    this.status = data.status;
    this.isRepost = data.isRepost;
    this.originalPostId = data.originalPostId;
    this.originalAuthorId = data.originalAuthorId;
  }

  public toPOJO(): Post {
    return {
      id: this.id,
      type: this.type,
      authorId: this.authorId,
      title: this.title,
      tags: this.tags,
      announcement: this.announcement,
      text: this.text,
      quoteText: this.quoteText,
      quoteAuthor: this.quoteAuthor,
      videoUrl: this.videoUrl,
      photoUrl: this.photoUrl,
      linkUrl: this.linkUrl,
      linkDescription: this.linkDescription,
      publishDate: this.publishDate,
      createDate: this.createDate,
      status: this.status,
      isRepost: this.isRepost,
      originalPostId: this.originalPostId,
      originalAuthorId: this.originalAuthorId,
    };
  }

  static fromObject(data: Post): PostEntity {
    return new PostEntity(data);
  }
}