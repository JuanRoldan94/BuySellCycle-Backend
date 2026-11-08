import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getEstadisticas() {
    const [
      totalVentas,
      totalClientes,
      totalProductos,
      ventasActivas,
      ventasPorEstado,
      ultimasVentas,
      productosMasVendidos,
    ] = await Promise.all([
      // Total de ventas (no archivadas, no canceladas)
      this.prisma.venta.count({
        where: { archivado: false, estado: { not: 'CANCELADO' } },
      }),

      // Total de clientes activos
      this.prisma.cliente.count({
        where: { archivado: false },
      }),

      // Total de productos activos
      this.prisma.producto.count({
        where: { archivado: false },
      }),

      // Todas las ventas activas para calcular ingresos y agrupar por mes
      this.prisma.venta.findMany({
        where: { archivado: false, estado: { not: 'CANCELADO' } },
        select: {
          montoTotal: true,
          fechaCreacion: true,
          modoPago: true,
        },
      }),

      // Ventas agrupadas por estado
      this.prisma.venta.groupBy({
        by: ['estado'],
        _count: { id: true },
        where: { archivado: false },
      }),

      // Últimas 5 ventas
      this.prisma.venta.findMany({
        where: { archivado: false },
        include: {
          cliente: true,
          sucursal: true,
          detalles: { include: { producto: true } },
        },
        orderBy: { fechaCreacion: 'desc' },
        take: 5,
      }),

      // Top 5 productos más vendidos
      this.prisma.detalleVenta.groupBy({
        by: ['productoId'],
        _sum: { cantidad: true },
        where: { archivado: false, venta: { estado: { not: 'CANCELADO' } } },
        orderBy: { _sum: { cantidad: 'desc' } },
        take: 5,
      }),
    ]);

    // Calcular ingresos totales
    const totalIngresos = ventasActivas.reduce(
      (acc, v) => acc + Number(v.montoTotal),
      0,
    );

    // Agrupar ventas por mes (últimos 6 meses)
    const ventasPorMes = this.agruparPorMes(ventasActivas);

    // Conteo por modo de pago
    const ventasPorModoPago = this.agruparPorModoPago(ventasActivas);

    // Buscar nombres de productos más vendidos
    const topProductos = await this.enriquecerTopProductos(productosMasVendidos);

    return {
      resumen: {
        totalVentas,
        totalIngresos: Math.round(totalIngresos * 100) / 100,
        totalClientes,
        totalProductos,
      },
      ventasPorEstado: ventasPorEstado.map((v) => ({
        estado: v.estado,
        cantidad: v._count.id,
      })),
      ventasPorMes,
      ventasPorModoPago,
      topProductos,
      ultimasVentas,
    };
  }

  private agruparPorMes(
    ventas: { montoTotal: any; fechaCreacion: Date }[],
  ) {
    const meses: Record<string, { total: number; cantidad: number }> = {};

    for (const v of ventas) {
      const fecha = new Date(v.fechaCreacion);
      const clave = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
      if (!meses[clave]) meses[clave] = { total: 0, cantidad: 0 };
      meses[clave].total += Number(v.montoTotal);
      meses[clave].cantidad += 1;
    }

    const nombresMeses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    return Object.entries(meses)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([clave, datos]) => {
        const [, mesStr] = clave.split('-');
        return {
          mes: nombresMeses[parseInt(mesStr, 10) - 1],
          total: Math.round(datos.total * 100) / 100,
          cantidad: datos.cantidad,
        };
      });
  }

  private agruparPorModoPago(
    ventas: { modoPago: string; montoTotal: any }[],
  ) {
    const modos: Record<string, { total: number; cantidad: number }> = {};

    for (const v of ventas) {
      if (!modos[v.modoPago]) modos[v.modoPago] = { total: 0, cantidad: 0 };
      modos[v.modoPago].total += Number(v.montoTotal);
      modos[v.modoPago].cantidad += 1;
    }

    return Object.entries(modos).map(([modo, datos]) => ({
      modo,
      total: Math.round(datos.total * 100) / 100,
      cantidad: datos.cantidad,
    }));
  }

  private async enriquecerTopProductos(
    agrupados: { productoId: number; _sum: { cantidad: number | null } }[],
  ) {
    const productos = await this.prisma.producto.findMany({
      where: { id: { in: agrupados.map((p) => p.productoId) } },
      select: { id: true, nombre: true },
    });

    const nombresMap = new Map(productos.map((p) => [p.id, p.nombre]));

    return agrupados.map((p) => ({
      nombre: nombresMap.get(p.productoId) ?? `Producto #${p.productoId}`,
      cantidad: p._sum.cantidad ?? 0,
    }));
  }
}

