import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserRole } from '@project/shared-types';

@Schema({
  collection: 'users',
  timestamps: true,
})
export class UserModel extends Document {
  @Prop({ required: true, unique: true })
  public email!: string;

  @Prop({ required: true })
  public name!: string;

  @Prop({
    required: true,
    default: UserRole.User,
    enum: Object.values(UserRole),
    type: String,
  })
  public role!: UserRole;

  @Prop()
  public avatar?: string;

  @Prop({ required: true })
  public passwordHash!: string;
  declare _id: Types.ObjectId;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
