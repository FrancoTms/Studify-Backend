import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';

// Traduce los errores de Prisma a respuestas HTTP claras
export function handlePrismaError(error: unknown): never {
  const code = (error as { code?: string } | null)?.code;
  if (code === 'P2002') throw new ConflictException('Ya existe un registro con esos datos únicos');
  if (code === 'P2003') throw new BadRequestException('Una de las referencias indicadas (usuario o materia) no existe');
  if (code === 'P2025') throw new NotFoundException('El registro no existe');
  throw error;
}
