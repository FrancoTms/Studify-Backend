import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { handlePrismaError } from '../prisma/prisma-error.util.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTaskDto) {
    const { dueDate, ...rest } = dto;
    try {
      return await this.prisma.task.create({ data: { ...rest, dueDate: dueDate ? new Date(dueDate) : undefined } });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  findAll() {
    return this.prisma.task.findMany({ orderBy: { id: 'asc' } });
  }

  async findOne(id: number) {
    const item = await this.prisma.task.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`No se encontró la tarea con id ${id}`);
    return item;
  }

  async update(id: number, dto: UpdateTaskDto) {
    await this.findOne(id);
    const { dueDate, ...rest } = dto;
    try {
      return await this.prisma.task.update({ where: { id }, data: { ...rest, dueDate: dueDate ? new Date(dueDate) : undefined } });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.task.delete({ where: { id } });
    return { message: `Tarea ${id} eliminado/a` };
  }
}
