import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBancoDto } from './dto/create-banco.dto.js';
import { UpdateBancoDto } from './dto/update-banco.dto.js';
import { PrismaService } from '../../../prisma/prisma.service.js';

@Injectable()
export class BancosService {
  constructor (private readonly prisma: PrismaService) {}
  create(data: CreateBancoDto) {
    return this.prisma.banco.create({ data });
  }

  findAll() {
    return this.prisma.banco.findMany({ where: { archivado: false }});
  }

  async findOne(id: number) {
    const registro = await this.prisma.banco.findFirst({
      where: {
        id: id,
        archivado: false
      },
    });
  }

  async update(id: number, data: UpdateBancoDto) {
    const banco = await this.prisma.banco.findUnique({ where: { id } });
    if (!banco) throw new NotFoundException(`Banco #${id} no encontrado`);

    return this.prisma.banco.update({ where: { id }, data})
  }

  async remove(id: number) {
    const banco = await this.prisma.banco.findUnique({ where: { id } });
    if (!banco) throw new NotFoundException(`Banco #${id} no encontrado`);

    return this.prisma.banco.update({
      where: { id },
      data: { archivado: true },
    });
  }
}
