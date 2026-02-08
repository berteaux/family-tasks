import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { User } from '@domain/entities/User';
import { UserRepository } from '@domain/ports/user-repository';

@Injectable()
export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  async save(user: User): Promise<void> {
    this.users.push(user);
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((u) => u.id === id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((u) => u.email === email) || null;
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }
}
