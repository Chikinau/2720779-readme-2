import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotifyStateModel } from './notify-state.model';

@Injectable()
export class NotifyStateRepository {
  constructor(
    @InjectModel(NotifyStateModel.name)
    private readonly stateModel: Model<NotifyStateModel>,
  ) {}

  public async getLastSentAt(key: string): Promise<Date | null> {
    const state = await this.stateModel.findOne({ key }).exec();
    return state ? state.lastSentAt : null;
  }

  public async updateLastSentAt(key: string, date: Date): Promise<void> {
    await this.stateModel
      .findOneAndUpdate(
        { key },
        { lastSentAt: date },
        { upsert: true, returnDocument: 'after' },
      )
      .exec();
  }
}
