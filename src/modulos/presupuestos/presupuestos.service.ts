import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreatePresupuestoDto } from './dto/create-presupuesto.dto.js';
import { Decimal } from 'decimal.js'

@Injectable()
export class PresupuestosService {
  constructor (private readonly prisma:PrismaService) {}
  
  async create(dto: CreatePresupuestoDto) {
    const { clienteId, items } = dto;

    const cliente = await this.prisma.cliente.findFirst({
      where: { id: clienteId, archivado: false },
    });

    if(!cliente){
      throw new NotFoundException(`Cliente con ID #${clienteId} no encontrado`);
    }

    let totalPresupuesto = new Decimal(0);
    const detallePresupuesto = [];

    for (const item of items) {
      const producto = await this.prisma.producto.findFirst({
        where: { id: item.productoId, archivado: false},
      });

      if (!producto) {
        throw new BadRequestException(`El producto con id #${item.productoId} no existe`);
      }

      const precioUnitario = new Decimal(producto.precioLista as any);
      const cantidad = new Decimal(item.cantidad);

      const subtotal = precioUnitario.times(cantidad);
      totalPresupuesto = totalPresupuesto.plus(subtotal);

      detallePresupuesto.push({
        productoId: producto.id,
        nombre: producto.nombre,
        cantidad: item.cantidad,
        precioUnitario: precioUnitario.toDecimalPlaces(2).toNumber(),
        subtotal: subtotal.toDecimalPlaces(2).toNumber(),
      });
    }

    return {
      cliente: {
        id: cliente.id,
        nombreCompleto: `${cliente.nombre} ${cliente.apellido}`,
        dni: cliente.dni,
      },
      fechaEmision: new Date(),
      detalle: detallePresupuesto,
      total: totalPresupuesto.toDecimalPlaces(2).toNumber(),
      validezDias: 15,
    };
  }
}
