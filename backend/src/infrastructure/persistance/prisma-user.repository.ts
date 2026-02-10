import { Injectable } from '@nestjs/common';
import { User } from '@domain/entities/User';
import { UserRepository } from '@domain/ports/user-repository';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { User as PrismaUser } from '@prisma-generated/client';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(user: User): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: user.id },
      update: {
        email: user.email,
        passwordHash: user.passwordHash,
        role: user.role,
      },
      create: {
        id: user.id,
        email: user.email,
        passwordHash: user.passwordHash,
        role: user.role,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id },
    });

    return prismaUser ? this.toDomain(prismaUser) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { email },
    });

    return prismaUser ? this.toDomain(prismaUser) : null;
  }

  async findAll(): Promise<User[]> {
    const prismaUsers = await this.prisma.user.findMany();
    return prismaUsers.map((u: PrismaUser) => this.toDomain(u));
  }

  private toDomain(prismaUser: PrismaUser): User {
    return User.reconstitute(
      prismaUser.id,
      prismaUser.email,
      prismaUser.passwordHash,
      prismaUser.role,
    );
  }
}
