import { User } from '@domain/entities/User';

export interface IUserRepository {
  create(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  find(): Promise<User[]>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
