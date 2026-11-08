import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaService } from '../prisma/prisma.service.js';
import { PdfService } from '../pdf/pdf.service.js';

@Injectable()
export class MailService {
    constructor(
        private readonly mailerService: MailerService,
        private readonly prisma: PrismaService,
        private readonly pdfService: PdfService
    ) {}

    async enviarPresupuesto(data: any) {
        const cliente = await this.prisma.cliente.findUnique({
            where: { id: data.clienteId }
        });

        if (!cliente) {
            throw new NotFoundException('Cliente no encontrado');
        }
        if (!cliente.email) {
            throw new BadRequestException(`El cliente ${cliente.nombre} no tiene un email registrado`);
        }

        const pdfBuffer = await this.pdfService.generarPresupuesto(data);

        await this.mailerService.sendMail({
            to: cliente.email,
            subject: 'Presupuesto - BuySellCycle S.R.L.',
            text: `Hola ${cliente.nombre},\n\nAdjuntamos el presupuesto solicitado.\n\nSaludos,\nEl equipo de BuySellCycle.`,
            attachments: [
                {
                    filename: `Presupuesto-${cliente.dni}.pdf`,
                    content: pdfBuffer,
                }
            ]
        });

        return { message: 'Presupuesto enviado exitosamente a ' + cliente.email };
    }

    async enviarComprobanteVenta(ventaId: number) {
        const venta = await this.prisma.venta.findUnique({
            where: { id: ventaId },
            include: { cliente: true },
        });

        if (!venta) {
            throw new NotFoundException(`La venta #${ventaId} no existe`);
        }

        if (!venta.cliente?.email) {
            throw new BadRequestException(`El cliente ${venta.cliente?.nombre || ''} no tiene un email registrado`);
        }

        const pdfBuffer = await this.pdfService.generarComprobanteVenta(ventaId);

        await this.mailerService.sendMail({
            to: venta.cliente.email,
            subject: `Comprobante de Compra - BuySellCycle S.R.L.`,
            text: `Hola ${venta.cliente.nombre},\n\nMuchas gracias por tu compra en BuySellCycle S.R.L.\nAdjuntamos comprobante.\n\nSaludos,\nEl equipo de BuySellCycle.`,
            attachments: [
                {
                    filename: `Comprobante-Venta-${venta.id}.pdf`,
                    content: pdfBuffer,
                }
            ]
        });

        return { message: `Comprobante de venta #${venta.id} enviado exitosamente a ${venta.cliente.email}` };
    }

    async notificarDisponibleParaRetiro(ventaId: number) {
        const venta = await this.prisma.venta.findUnique({
            where: { id: ventaId },
            include: { cliente: true, sucursal: true },
        });

        if (!venta || !venta.cliente?.email) {
            return;
        }

        await this.mailerService.sendMail({
            to: venta.cliente.email,
            subject: `¡Tu pedido #V-${String(venta.id).padStart(4, '0')} ya está disponible para retirar! - BuySellCycle S.R.L.`,
            text: `Hola ${venta.cliente.nombre},\n\nTe informamos que tu pedido #V-${String(venta.id).padStart(4, '0')} ya se encuentra listo y disponible para ser retirado en la sucursal:\n🏢 ${venta.sucursal?.nombre || 'Sucursal'}\n\nPor favor presentate con tu DNI para retirarlo.\n\nSaludos,\nEl equipo de BuySellCycle S.R.L.`,
        });
    }

    async notificarPedidoEnCamino(ventaId: number) {
        const venta = await this.prisma.venta.findUnique({
            where: { id: ventaId },
            include: { cliente: true },
        });

        if (!venta || !venta.cliente?.email) {
            return;
        }

        await this.mailerService.sendMail({
            to: venta.cliente.email,
            subject: `¡Tu pedido #V-${String(venta.id).padStart(4, '0')} está en camino! - BuySellCycle S.R.L.`,
            text: `Hola ${venta.cliente.nombre},\n\nTe informamos que tu pedido #V-${String(venta.id).padStart(4, '0')} está en camino hacia tu domicilio${venta.direccionEntregaTexto ? ` (${venta.direccionEntregaTexto})` : ''}.\n\nSaludos,\nEl equipo de BuySellCycle S.R.L.`,
        });
    }
}