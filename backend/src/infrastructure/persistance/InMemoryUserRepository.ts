import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { User } from '@domain/entities/User';
import { IUserRepository } from '@domain/repositories/IUserRepository';

@Injectable()
export class InMemoryUserRepository implements IUserRepository {
  private users: User[] = [];

  async create(user: User): Promise<User> {
    this.users.push(user);
    return Promise.resolve(user);
  }

  async findById(id: string): Promise<User | null> {
    return Promise.resolve(this.users.find((u) => u.id === id) || null);
  }

  async findByEmail(email: string): Promise<User | null> {
    return Promise.resolve(this.users.find((u) => u.email === email) || null);
  }

  async find(): Promise<User[]> {
    return Promise.resolve(this.users);
  }
}
