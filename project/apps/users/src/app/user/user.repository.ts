import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository {
  private readonly users = new Map<string, UserEntity>();

  public async save(entity: UserEntity): Promise<UserEntity> {
    this.users.set(entity.id, entity);
    return entity;
  }

  public async findById(id: string): Promise<UserEntity | null> {
    return this.users.get(id) ?? null;
  }

  public async findByEmail(email: string): Promise<UserEntity | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  public async exists(email: string): Promise<boolean> {
    return (await this.findByEmail(email)) !== null;
  }
}