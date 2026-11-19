import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { handlePrismaError } from '../prisma/prisma-error.util.js';
import { CreateExamDto } from './dto/create-exam.dto.js';
import { UpdateExamDto } from './dto/update-exam.dto.js';

@Injectable()
export class ExamsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateExamDto) {
    const { examDate, ...rest } = dto;
    try {
      return await this.prisma.exam.create({ data: { ...rest, examDate: new Date(examDate) } });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  findAll() {
    return this.prisma.exam.findMany({ orderBy: { id: 'asc' } });
  }

  async findOne(id: number) {
    const item = await this.prisma.exam.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`No se encontró el examen con id ${id}`);
    return item;
  }

  async update(id: number, dto: UpdateExamDto) {
    await this.findOne(id);
    const { examDate, ...rest } = dto;
    try {
      return await this.prisma.exam.update({ where: { id }, data: { ...rest, examDate: examDate ? new Date(examDate) : undefined } });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.exam.delete({ where: { id } });
    return { message: `Examen ${id} eliminado/a` };
  }
}
