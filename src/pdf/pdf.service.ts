import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import PDFDocument from 'pdfkit';

@Injectable()
export class PdfService {
    constructor (private readonly prisma: PrismaService) {}

    async generarComprobanteVenta (ventaId: number) : Promise<Buffer> {
        const venta = await this.prisma.venta.findUnique({
            where: { id: ventaId },
            include: {
                cliente: true,
                sucursal: true,
                detalles: { include: { producto: true }},
                plan: { include: { tarjeta: true, banco: true }}
            }
        });

        if (!venta) throw new NotFoundException(`La venta ${ventaId} no existe`);

        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ margin: 50, size: 'A4' });
            const buffers: Buffer[] = [];

            doc.on('data', (buffer: any) => buffers.push(buffer));
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', reject);

            //Diseño del PDF
            doc.fontSize(22).text('COMPROBANTE DE VENTA', { align: 'center' });
            doc.moveDown();

            doc.fontSize(12).text(`Nro Venta: 000${venta.id}`);
            doc.text(`Fecha: ${venta.fechaCreacion.toLocaleDateString('es-AR')}`);
            doc.text(`Cliente: ${venta.cliente.nombre} ${venta.cliente.apellido} (DNI: ${venta.cliente.dni})`);
            doc.text(`Sucursal: ${venta.sucursal.nombre}`);
            doc.moveDown();

            doc.fontSize(14).text('Detalle de los productos:', { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(12);

            venta.detalles.forEach(detalle => {
                doc.text(`- ${detalle.cantidad}x ${detalle.producto.nombre} | Subtotal: $${detalle.subtotal}`);
            });

            doc.moveDown(2);

            doc.font('Helvetica-Bold')
                .fontSize(16)
                .text(`TOTAL FINAL: $${venta.montoTotal}`);
        
            doc.font('Helvetica');

            if (venta.modoPago === 'PLAN') {
                doc.fontSize(12).fillColor('gray')
                    .text(`Abonado con ${venta.plan.tarjeta.nombre} - ${ venta.plan.banco.nombre} (${venta.plan.cantidadCuotas} cuotas)`)
            }

            doc.end();
        });
    }
}
