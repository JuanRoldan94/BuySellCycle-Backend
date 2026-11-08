import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { CreateClienteDto } from './dto/create-cliente.dto.js';
import { UpdateClienteDto } from './dto/update-cliente.dto.js';
import { CreateDireccionEntregaDto } from './dto/create-direccion-entrega.dto.js';
import { UpdateDireccionEntregaDto } from './dto/update-direccion-entrega.dto.js';

@Injectable()
export class ClientesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createClienteDto: CreateClienteDto) {
    const clienteExistenteDni = await this.prisma.cliente.findUnique({
      where: { dni: createClienteDto.dni },
    });

    if (clienteExistenteDni) {
      throw new BadRequestException(`Ya existe un cliente con el DNI/Cuit ${createClienteDto.dni}`);
    }

    if (createClienteDto.email) {
      const clienteExistenteEmail = await this.prisma.cliente.findUnique({
        where: { email: createClienteDto.email },
      });

      if (clienteExistenteEmail) {
        throw new BadRequestException(`El email ${createClienteDto.email} esta asignado a otro cliente`);
      }
    }

    return await this.prisma.cliente.create({
      data: createClienteDto,
      include: {
        direccionEntregas: {
          where: { archivado: false },
          orderBy: { principal: 'desc' }
        },
        provincia: true,
        localidad: true,
      }
    });
  }

  async findAll() {
    return await this.prisma.cliente.findMany({
      where: { archivado: false },
      include: {
        direccionEntregas: {
          where: { archivado: false },
          orderBy: { principal: 'desc' }
        },
        provincia: true,
        localidad: true,
      },
      orderBy: { nombre: 'asc' },
    });
  }

  async findOne(id: number) {
    const registro = await this.prisma.cliente.findFirst({
      where: { 
        id, 
        archivado: false 
      },
      include: {
        direccionEntregas: {
          where: { archivado: false },
          orderBy: { principal: 'desc' }
        },
        provincia: true,
        localidad: true,
      }
    });

    if (!registro) {
      throw new NotFoundException(`Registro con ID #${id} no encontrado`);
    }

    return registro;
  }

  async update(id: number, updateClienteDto: UpdateClienteDto) {
    await this.findOne(id); 

    return await this.prisma.cliente.update({
      where: { id },
      data: updateClienteDto,
      include: {
        direccionEntregas: {
          where: { archivado: false },
          orderBy: { principal: 'desc' }
        },
        provincia: true,
        localidad: true,
      }
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return await this.prisma.cliente.update({
      where: { id },
      data: { archivado: true },
    });
  }

  // ==========================================
  // GESTIÓN DE DIRECCIONES DE ENTREGA
  // ==========================================

  async listarDirecciones(clienteId: number) {
    await this.findOne(clienteId);

    return await this.prisma.direccionEntrega.findMany({
      where: {
        clienteId,
        archivado: false,
      },
      orderBy: [
        { principal: 'desc' },
        { fechaCreacion: 'desc' }
      ]
    });
  }

  async crearDireccion(clienteId: number, dto: CreateDireccionEntregaDto) {
    await this.findOne(clienteId);

    return await this.prisma.$transaction(async (tx) => {
      const cantidadActivas = await tx.direccionEntrega.count({
        where: { clienteId, archivado: false }
      });

      // Si es la primera o se marca explícitamente como principal, debe ser principal
      const debeSerPrincipal = cantidadActivas === 0 || dto.principal === true;

      if (debeSerPrincipal) {
        // Desmarcar las demás
        await tx.direccionEntrega.updateMany({
          where: { clienteId, archivado: false },
          data: { principal: false }
        });
      }

      return await tx.direccionEntrega.create({
        data: {
          clienteId,
          direccion: dto.direccion.trim(),
          principal: debeSerPrincipal,
        }
      });
    });
  }

  async actualizarDireccion(clienteId: number, direccionId: number, dto: UpdateDireccionEntregaDto) {
    await this.findOne(clienteId);

    const dir = await this.prisma.direccionEntrega.findFirst({
      where: { id: direccionId, clienteId, archivado: false }
    });

    if (!dir) {
      throw new NotFoundException(`Dirección #${direccionId} no encontrada para el cliente #${clienteId}`);
    }

    return await this.prisma.$transaction(async (tx) => {
      if (dto.principal === true) {
        // Desmarcar todas las demás direcciones de este cliente
        await tx.direccionEntrega.updateMany({
          where: { clienteId, id: { not: direccionId }, archivado: false },
          data: { principal: false }
        });
      }

      return await tx.direccionEntrega.update({
        where: { id: direccionId },
        data: {
          ...(dto.direccion ? { direccion: dto.direccion.trim() } : {}),
          ...(typeof dto.principal === 'boolean' ? { principal: dto.principal } : {}),
        }
      });
    });
  }

  async eliminarDireccion(clienteId: number, direccionId: number) {
    await this.findOne(clienteId);

    const dir = await this.prisma.direccionEntrega.findFirst({
      where: { id: direccionId, clienteId, archivado: false }
    });

    if (!dir) {
      throw new NotFoundException(`Dirección #${direccionId} no encontrada`);
    }

    return await this.prisma.$transaction(async (tx) => {
      const eliminada = await tx.direccionEntrega.update({
        where: { id: direccionId },
        data: { archivado: true, principal: false }
      });

      // Si la dirección eliminada era la principal, promovemos la siguiente dirección activa más reciente
      if (dir.principal) {
        const siguiente = await tx.direccionEntrega.findFirst({
          where: { clienteId, archivado: false, id: { not: direccionId } },
          orderBy: { fechaCreacion: 'desc' }
        });

        if (siguiente) {
          await tx.direccionEntrega.update({
            where: { id: siguiente.id },
            data: { principal: true }
          });
        }
      }

      return eliminada;
    });
  }
}
