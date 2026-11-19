import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateAuthDto } from './dto/create-auth.dto.js';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(dto: CreateAuthDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    // Mismo mensaje para correo inexistente y contraseña incorrecta
    if (!user || !(await compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }
    return { id: user.id, name: user.name, email: user.email };
  }
}
