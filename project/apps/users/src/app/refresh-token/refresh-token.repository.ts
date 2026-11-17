import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RefreshTokenModel } from './refresh-token.model';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectModel(RefreshTokenModel.name)
    private readonly refreshTokenModel: Model<RefreshTokenModel>,
  ) {}

  public async create(data: {
    tokenId: string;
    userId: string;
    expiresAt: Date;
  }): Promise<void> {
    await this.refreshTokenModel.create(data);
  }

  public async findByTokenId(
    tokenId: string,
  ): Promise<RefreshTokenModel | null> {
    return this.refreshTokenModel.findOne({ tokenId }).exec();
  }

  public async deleteByTokenId(tokenId: string): Promise<void> {
    await this.refreshTokenModel.deleteOne({ tokenId }).exec();
  }

  public async deleteByUserId(userId: string): Promise<void> {
    await this.refreshTokenModel.deleteMany({ userId }).exec();
  }
}
