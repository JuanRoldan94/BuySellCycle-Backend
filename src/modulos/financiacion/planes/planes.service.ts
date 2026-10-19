import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreatePlaneDto } from './dto/create-plane.dto.js';
import { UpdatePlaneDto } from './dto/update-plane.dto.js';
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

  async findOne(id: number) {
    const registro = await this.prisma.plan.findFirst({
      where: {
        id: id,
        archivado: false
      },
    });
  }

  findAll() {
    return this.prisma.plan.findMany({
      where: { archivado: false },
      include: { tarjeta: true, banco: true },
    });
  }

  async update(id: number, data: UpdatePlaneDto) {
    const tarjeta = await this.prisma.tarjeta.findUnique({ where: { id } });
    if (!tarjeta) throw new NotFoundException(`Tarjeta #${id} no encontrada`);

    return this.prisma.tarjeta.update({ where: { id }, data})
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
