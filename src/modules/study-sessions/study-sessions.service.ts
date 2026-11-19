import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { handlePrismaError } from '../prisma/prisma-error.util.js';
import { CreateStudySessionDto } from './dto/create-study-session.dto.js';
import { UpdateStudySessionDto } from './dto/update-study-session.dto.js';

// Los enums de Prisma no admiten espacios: 'Mapas mentales' se guarda como Mapas_mentales
const TECHNIQUE_MAP = {
  Pomodoro: 'Pomodoro',
  'Mapas mentales': 'Mapas_mentales',
  'Active Recall': 'Active_Recall',
  Lectura: 'Lectura',
} as const;

@Injectable()
export class StudySessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateStudySessionDto) {
    try {
      return await this.prisma.studySession.create({
        data: {
          userId: dto.userId,
          subjectId: dto.subjectId,
          technique: dto.technique ? TECHNIQUE_MAP[dto.technique] : undefined,
          startedAt: new Date(dto.startedAt),
          durationMinutes: dto.durationMinutes,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  findAll() {
    return this.prisma.studySession.findMany({ orderBy: { id: 'asc' } });
  }

  async findOne(id: number) {
    const item = await this.prisma.studySession.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`No se encontró la sesión de estudio con id ${id}`);
    return item;
  }

  async update(id: number, dto: UpdateStudySessionDto) {
    await this.findOne(id);
    const { technique, startedAt, ...rest } = dto;
    try {
      return await this.prisma.studySession.update({
        where: { id },
        data: {
          ...rest,
          technique: technique ? TECHNIQUE_MAP[technique] : undefined,
          startedAt: startedAt ? new Date(startedAt) : undefined,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.studySession.delete({ where: { id } });
    return { message: `Sesión de estudio ${id} eliminada` };
  }
}