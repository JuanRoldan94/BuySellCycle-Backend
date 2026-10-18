import { Injectable, NotFoundException } from '@nestjs/common';
import { SimularFinanciacionDto } from './dto/simular-financiacion.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class FinanciacionService {
  constructor(private readonly prisma: PrismaService) {}

  async simularCuotas(datos: SimularFinanciacionDto) {
    const { montoBase, planId } = datos;

    const plan = await this.prisma.plan.findUnique({
      where: { id: planId, archivado: false },
      include: { 
        tarjeta: true, 
        banco: true 
      }
    });

    if (!plan) {
      throw new NotFoundException(`El plan de financiación con ID ${planId} no existe o está inactivo.`);
    }

    const cuotas = plan.cantidadCuotas;
    const tasa = Number(plan.tasaFinanciacion);

    const montoInteres = montoBase * (tasa / 100);
    const montoTotal = montoBase + montoInteres;
    const valorCuota = montoTotal / cuotas;

    return {
      tarjeta: plan.tarjeta.nombre,
      banco: plan.banco.nombre,
      montoBase: Number(montoBase.toFixed(2)),
      cantidadCuotas: cuotas,
      tasaAplicada: `${tasa}%`,
      recargoFinanciero: Number(montoInteres.toFixed(2)),
      montoTotalFinanciado: Number(montoTotal.toFixed(2)),
      valorCuotaFija: Number(valorCuota.toFixed(2)),
    };
  }
}