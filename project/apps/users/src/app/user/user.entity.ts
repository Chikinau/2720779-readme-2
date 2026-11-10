import { compare, genSalt, hash } from 'bcrypt';
import { AuthUser, UserRole } from '@project/shared-types';
import { SALT_ROUNDS } from './user.consts';


export class UserEntity implements AuthUser {
  public id!: string;            // <-- обязательно, с !
  public email!: string;
  public name!: string;
  public role!: UserRole;
  public avatar?: string;        // опциональное — без !
  public createdAt!: Date;
  public passwordHash!: string;

  constructor(user: AuthUser) {
    this.populate(user);
  }

  public populate(data: AuthUser): void {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.role = data.role;
    this.avatar = data.avatar;
    this.createdAt = data.createdAt;
    this.passwordHash = data.passwordHash;
  }

  public toPOJO() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      role: this.role,
      avatar: this.avatar,
      createdAt: this.createdAt,
      passwordHash: this.passwordHash,
    };
  }

  public async setPassword(password: string): Promise<this> {
    const salt = await genSalt(SALT_ROUNDS);
    this.passwordHash = await hash(password, salt);
    return this;
  }

  public async comparePassword(password: string): Promise<boolean> {
    return compare(password, this.passwordHash);
  }

  static fromObject(data: AuthUser): UserEntity {
    return new UserEntity(data);
  }
}