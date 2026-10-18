import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { CrearVentaDto } from './dto/crear-venta.dto.js';

@Injectable()
export class VentasService {
    constructor(private readonly prisma: PrismaService) {}

    async registrarVenta(datos: CrearVentaDto) {
        return await this.prisma.$transaction(async (tx) => {
            let totalSinInteres = 0;
            const detallesParaInsertar = [];

            for (const detalle of datos.detalles) {
                const producto = await tx.producto.findUnique({ where: {id: detalle.productoId}});

                if (!producto) throw new BadRequestException (`El producto ${detalle.productoId} no existe`);
                if (producto.stockTotal < detalle.cantidad) {
                    throw new BadRequestException(`Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stockTotal}`);
                }

                await tx.producto.update({
                    where: { id: producto.id},
                    data: { stockTotal: producto.stockTotal - detalle.cantidad}
                });

                const precioUsar = datos.modoPago === 'CONTADO'
                    ? Number(producto.precioContado)
                    : Number(producto.precioLista);

                const subtotal = precioUsar * detalle.cantidad;
                totalSinInteres += subtotal;

                detallesParaInsertar.push({
                    productoId: producto.id,
                    cantidad: detalle.cantidad,
                    precioUnitario: precioUsar,
                    subtotal: subtotal
                });
            }

            let montoTotalFinal = totalSinInteres;
            const plan = await tx.plan.findUnique({ where: { id: datos.planId }});
            
            if (!plan) throw new BadRequestException(`El plan seleccionado no existe`);

            if (datos.modoPago === 'PLAN') {
                const recargo = totalSinInteres * (Number(plan.tasaFinanciacion) / 100);
                montoTotalFinal += recargo;
            }

            const nuevaVenta = await tx.venta.create ({
                data: {
                    clienteId: datos.clienteId,
                    sucursalId: datos.sucursalId,
                    planId: datos.planId,
                    modoPago: datos.modoPago,
                    modoEntrega: datos.modoEntrega,
                    direccionEntregaTexto: datos.direccionEntregaTexto,
                    montoTotal: montoTotalFinal,
                    detalles: {
                        create: detallesParaInsertar
                    }
                },
                include: {
                    detalles: { include: {producto: true } },
                    plan: { include: { tarjeta: true, banco: true } },
                    cliente: true
                }
            });

            return nuevaVenta;
        });
    }
}
