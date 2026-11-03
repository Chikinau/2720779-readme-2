import { Comment } from '@project/shared-types';

export class CommentEntity implements Comment {
  public id!: string;
  public postId!: string;
  public userId!: string;
  public text!: string;
  public createDate!: Date;

  constructor(comment: Comment) {
    this.populate(comment);
  }

  public populate(data: Comment): void {
    this.id = data.id;
    this.postId = data.postId;
    this.userId = data.userId;
    this.text = data.text;
    this.createDate = data.createDate;
  }

  public toPOJO(): Comment {
    return {
      id: this.id,
      postId: this.postId,
      userId: this.userId,
      text: this.text,
      createDate: this.createDate,
    };
  }

  static fromObject(data: Comment): CommentEntity {
    return new CommentEntity(data);
  }
}
