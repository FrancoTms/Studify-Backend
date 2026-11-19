import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { handlePrismaError } from '../prisma/prisma-error.util.js';
import { CreateSubjectDto } from './dto/create-subject.dto.js';
import { UpdateSubjectDto } from './dto/update-subject.dto.js';

@Injectable()
export class SubjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSubjectDto) {
    try {
      return await this.prisma.subject.create({ data: dto });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  findAll() {
    return this.prisma.subject.findMany({ orderBy: { id: 'asc' } });
  }

  async findOne(id: number) {
    const item = await this.prisma.subject.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`No se encontró la materia con id ${id}`);
    return item;
  }

  async update(id: number, dto: UpdateSubjectDto) {
    await this.findOne(id);
    try {
      return await this.prisma.subject.update({ where: { id }, data: dto });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.subject.delete({ where: { id } });
    return { message: `Materia ${id} eliminado/a` };
  }
}
