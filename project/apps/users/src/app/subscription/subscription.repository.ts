import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubscriptionModel } from './subscription.model';

@Injectable()
export class SubscriptionRepository {
  constructor(
    @InjectModel(SubscriptionModel.name)
    private readonly subscriptionModel: Model<SubscriptionModel>,
  ) {}

  public async subscribe(
    followerId: string,
    followingId: string,
  ): Promise<void> {
    await this.subscriptionModel
      .updateOne(
        { followerId, followingId },
        { followerId, followingId },
        { upsert: true },
      )
      .exec();
  }

  public async unsubscribe(
    followerId: string,
    followingId: string,
  ): Promise<void> {
    await this.subscriptionModel.deleteOne({ followerId, followingId }).exec();
  }

  public async exists(
    followerId: string,
    followingId: string,
  ): Promise<boolean> {
    const doc = await this.subscriptionModel
      .findOne({ followerId, followingId })
      .select({ _id: 1 })
      .exec();
    return doc !== null;
  }

  public async countFollowers(userId: string): Promise<number> {
    return this.subscriptionModel
      .countDocuments({ followingId: userId })
      .exec();
  }

  public async countFollowing(userId: string): Promise<number> {
    return this.subscriptionModel.countDocuments({ followerId: userId }).exec();
  }

  public async findFollowingIds(userId: string): Promise<string[]> {
    const docs = await this.subscriptionModel
      .find({ followerId: userId })
      .select({ followingId: 1 })
      .exec();
    return docs.map((d) => d.followingId);
  }
}
