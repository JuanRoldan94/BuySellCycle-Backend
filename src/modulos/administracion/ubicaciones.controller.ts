import { Controller, Get } from '@nestjs/common';
// Asegurate de importar tu PrismaService desde la ruta correcta de tu proyecto
import { PrismaService } from '../../prisma/prisma.service.js'; 

@Controller()
export class UbicacionesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('provincias')
  async getProvincias() {
    return await this.prisma.provincia.findMany({
      where: { archivado: false },
      orderBy: { nombre: 'asc' },
    });
  }

  @Get('localidades')
  async getLocalidades() {
    return await this.prisma.localidad.findMany({
      where: { archivado: false },
      orderBy: { nombre: 'asc' },
    });
  }
}