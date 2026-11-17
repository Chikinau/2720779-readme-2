import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'notify-state',
  timestamps: true,
})
export class NotifyStateModel extends Document {
  @Prop({ required: true })
  public key!: string;

  @Prop({ required: true })
  public lastSentAt!: Date;

  declare id: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export const NotifyStateSchema = SchemaFactory.createForClass(NotifyStateModel);