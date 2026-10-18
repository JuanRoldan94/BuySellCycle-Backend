import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTarjetaDto } from './dto/create-tarjeta.dto.js';
import { UpdateTarjetaDto } from './dto/update-tarjeta.dto.js';
import { PrismaService } from '../../../prisma/prisma.service.js';

@Injectable()
export class TarjetasService {
  constructor(private readonly prisma: PrismaService){}
  create(data: CreateTarjetaDto) {
    return this.prisma.banco.create({ data });
  }

  findAll() {
    return this.prisma.tarjeta.findMany({ where: { archivado: false }});
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} tarjeta`;
  // }

  async update(id: number, data: UpdateTarjetaDto) {
    const tarjeta = await this.prisma.tarjeta.findUnique({ where: { id } });
    if (!tarjeta) throw new NotFoundException(`Tarjeta #${id} no encontrada`);

    return this.prisma.tarjeta.update({ where: { id }, data})
  }

  async remove(id: number) {
    const tarjeta = await this.prisma.tarjeta.findUnique({ where: { id } });
    if (!tarjeta) throw new NotFoundException(`Tarjeta #${id} no encontrada`);

    return this.prisma.tarjeta.update({
      where: { id },
      data: { archivado: true }
    });
  }
}
