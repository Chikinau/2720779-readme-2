import { UserRdo } from './user.rdo';

export class LoggedUserRdo extends UserRdo {
  public accessToken!: string;
}