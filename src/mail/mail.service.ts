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
            subject: 'Tu Presupuesto - BuySellCycle S.R.L.',
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
            subject: `Comprobante de Compra #${venta.id} - BuySellCycle S.R.L.`,
            text: `Hola ${venta.cliente.nombre},\n\nMuchas gracias por tu compra en BuySellCycle S.R.L.\nAdjuntamos el comprobante de tu venta #${venta.id}.\n\nSaludos cordiales,\nEl equipo de BuySellCycle.`,
            attachments: [
                {
                    filename: `Comprobante-Venta-${venta.id}.pdf`,
                    content: pdfBuffer,
                }
            ]
        });

        return { message: `Comprobante de venta #${venta.id} enviado exitosamente a ${venta.cliente.email}` };
    }
}