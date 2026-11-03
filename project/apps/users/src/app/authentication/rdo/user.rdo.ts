import { UserRole } from '@project/shared-types';

export class UserRdo {
  public id!: string;
  public email!: string;
  public name!: string;
  public role!: UserRole;
  public avatar?: string;
  public createdAt!: Date;
}
