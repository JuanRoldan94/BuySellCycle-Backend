import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { CrearVentaDto } from './dto/crear-venta.dto.js';
import { EstadoVenta } from '@prisma/client';

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

    async findAll() {
        return await this.prisma.venta.findMany({
            where: {
                archivado: false
            },
            include: {
                cliente: true,
                sucursal: true,
                plan: {
                    include: {
                        tarjeta: true,
                        banco: true,
                    }
                },
                detalles: {
                    include: {
                        producto: true
                    }
                }
            },
            orderBy: {
                fechaCreacion: 'desc'
            }
        });
    }

    async actualizarEstado(id: number, estadoNuevo: EstadoVenta) {
        return await this.prisma.$transaction(async (tx) => {
            const venta = await tx.venta.findUnique({
                where: { id },
                include: { detalles: true }
            });

            if (!venta) {
                throw new NotFoundException(`La venta #${id} no existe`);
            }

            if (venta.estado === 'CANCELADO' && estadoNuevo !== 'CANCELADO') {
                throw new BadRequestException('Una venta cancelada no puede volver a activarse. Debe crear una nueva.');
            }

            if (estadoNuevo === 'CANCELADO' && venta.estado !== 'CANCELADO') {
                for (const detalle of venta.detalles) {
                await tx.producto.update({
                    where: { id: detalle.productoId },
                    data: {
                    stockTotal: { increment: detalle.cantidad }
                    }
                });
                }
            }

            return await tx.venta.update({
                where: { id },
                data: { estado: estadoNuevo },
            });
        });
    }
}
