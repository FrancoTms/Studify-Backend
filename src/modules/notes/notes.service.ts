import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { handlePrismaError } from '../prisma/prisma-error.util.js';
import { CreateNoteDto } from './dto/create-note.dto.js';
import { UpdateNoteDto } from './dto/update-note.dto.js';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateNoteDto) {
    try {
      return await this.prisma.note.create({ data: dto });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  findAll() {
    return this.prisma.note.findMany({ orderBy: { id: 'asc' } });
  }

  async findOne(id: number) {
    const item = await this.prisma.note.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`No se encontró el apunte con id ${id}`);
    return item;
  }

  async update(id: number, dto: UpdateNoteDto) {
    await this.findOne(id);
    try {
      return await this.prisma.note.update({ where: { id }, data: dto });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.note.delete({ where: { id } });
    return { message: `Apunte ${id} eliminado/a` };
  }
}
