import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  collection: 'refresh-tokens',
  timestamps: true,
})
export class RefreshTokenModel extends Document {
  @Prop({ required: true })
  public tokenId!: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'UserModel' })
  public userId!: Types.ObjectId;

  @Prop({ required: true })
  public expiresAt!: Date;

  declare id: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export const RefreshTokenSchema =
  SchemaFactory.createForClass(RefreshTokenModel);

RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
