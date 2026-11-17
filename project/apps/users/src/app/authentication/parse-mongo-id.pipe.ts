import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform<string, string> {
  public transform(value: string): string {
    if (!isValidObjectId(value)) {
      throw new BadRequestException('Невалидный идентификатор пользователя');
    }
    return value;
  }
}
