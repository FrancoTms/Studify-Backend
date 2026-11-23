import { Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { handlePrismaError } from '../prisma/prisma-error.util.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

// Nunca se devuelve passwordHash
const publicSelect = { id: true, name: true, email: true, createdAt: true };

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const { password, ...data } = dto;
    try {
      return await this.prisma.user.create({
        data: { ...data, passwordHash: await hash(password, 10) },
        select: publicSelect,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  findAll() {
    return this.prisma.user.findMany({ select: publicSelect, orderBy: { id: 'asc' } });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id }, select: publicSelect });
    if (!user) throw new NotFoundException(`No se encontró el usuario con id ${id}`);
    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.findOne(id);
    const { password, ...data } = dto;
    try {
      return await this.prisma.user.update({
        where: { id },
        data: { ...data, ...(password ? { passwordHash: await hash(password, 10) } : {}) },
        select: publicSelect,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.user.delete({ where: { id } });
    return { message: `Usuario ${id} eliminado` };
  }
}
