// user.interface.ts
import { Entity } from './common.interface';

export enum UserRole {
  Admin = 'admin',
  User = 'user',
}


export interface User extends Entity<string> {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
}

export interface AuthUser extends User {
  passwordHash: string;
}