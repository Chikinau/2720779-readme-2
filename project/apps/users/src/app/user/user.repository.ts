import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserEntity } from './user.entity';
import { UserModel } from './user.model';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>,
  ) {}

  public async save(entity: UserEntity): Promise<UserEntity> {
    const document = await this.userModel.create({
      email: entity.email,
      name: entity.name,
      role: entity.role,
      avatar: entity.avatar,
      passwordHash: entity.passwordHash,
    });
    return this.toEntity(document);
  }

  public async findById(id: string): Promise<UserEntity | null> {
    const document = await this.userModel.findById(id).exec();
    return document ? this.toEntity(document) : null;
  }

  public async findByEmail(email: string): Promise<UserEntity | null> {
    const document = await this.userModel.findOne({ email }).exec();
    return document ? this.toEntity(document) : null;
  }

  public async exists(email: string): Promise<boolean> {
    const document = await this.userModel
      .findOne({ email })
      .select({ _id: 1 })
      .exec();
    return document !== null;
  }
  private toEntity(document: UserModel): UserEntity {
    return UserEntity.fromObject({
      id: document._id.toString(),
      email: document.email,
      name: document.name,
      role: document.role,
      avatar: document.avatar,
      passwordHash: document.passwordHash,
      createdAt: document.createdAt,
    });
  }
}
