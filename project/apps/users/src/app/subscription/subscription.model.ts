import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'subscriptions',
  timestamps: true,
})
export class SubscriptionModel extends Document {
  @Prop({ required: true })
  public followerId!: string;

  @Prop({ required: true })
  public followingId!: string;

  declare id: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export const SubscriptionSchema =
  SchemaFactory.createForClass(SubscriptionModel);

SubscriptionSchema.index({ followerId: 1, followingId: 1 }, { unique: true });
