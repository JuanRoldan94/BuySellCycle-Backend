import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreatePlaneDto } from './dto/create-plane.dto.js';
import { PrismaService } from '../../../prisma/prisma.service.js';

@Injectable()
export class PlanesService {
  constructor(private readonly prisma:PrismaService) {}

  async create(data: CreatePlaneDto) {
    try{
      return await this.prisma.plan.create({ data })
    } catch (error) {
      if ((error as any).code === 'P2002') {
        throw new ConflictException('Ya existe un plan con esa misma cantidad de cuotas para esa combinacion Tarjeta/Banco');
      }
      throw error;
    }
  }

  findAll() {
    return this.prisma.plan.findMany({
      where: { archivado: false },
      include: { tarjeta: true, banco: true },
    });
  }

  async remove(id: number) {
    const plan = await this.prisma.plan.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException(`Plan #${id} no encontrado`);

    return this.prisma.plan.update({
      where: { id },
      data: { archivado: true },
    });
  }
}
