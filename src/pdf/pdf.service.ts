import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import PDFDocument from 'pdfkit';

@Injectable()
export class PdfService {
    constructor(private readonly prisma: PrismaService) {}

    private formatearMoneda(monto: number): string {
        return new Intl.NumberFormat('es-AR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(Number(monto || 0));
    }

    private formatearFecha(fecha: Date | string): string {
        const d = new Date(fecha);
        const opciones: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' };
        const fechaFormateada = d.toLocaleDateString('es-AR', opciones);
        return fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1).replace(/\//g, '.');
    }

    private dibujarEncabezado(doc: typeof PDFDocument, titulo: string, numeroDoc: string, fecha: Date | string) {
        doc.fillColor('#333333');
        
        doc.fontSize(20).font('Helvetica-Bold').text('BuySellCycle S.R.L.', 50, 50);
        doc.fontSize(10).font('Helvetica')
           .text('Rafaela, Santa Fe, Argentina', 50, 90);

        doc.fontSize(16).font('Helvetica-Bold').text(titulo, 200, 50, { align: 'right' });
        doc.fontSize(10).font('Helvetica')
           .text(`Nro: ${numeroDoc}`, 200, 75, { align: 'right' })
           .text(`Fecha: ${this.formatearFecha(fecha)}`, 200, 90, { align: 'right' });

        doc.moveTo(50, 120).lineTo(550, 120).strokeColor('#cccccc').lineWidth(1).stroke();
    }

    private dibujarDatosCliente(doc: typeof PDFDocument, cliente: any, yPosition: number) {
        doc.fillColor('#000000').fontSize(12).font('Helvetica-Bold').text('Datos del Cliente', 50, yPosition);
        doc.fontSize(10).font('Helvetica')
           .text(`Nombre: ${cliente.nombre} ${cliente.apellido}`, 50, yPosition + 15)
           .text(`DNI: ${cliente.dni}`, 50, yPosition + 30);
           
        doc.moveTo(50, yPosition + 55).lineTo(550, yPosition + 55).strokeColor('#cccccc').stroke();
    }

    async generarComprobanteVenta(ventaId: number): Promise<Buffer> {
        const venta = await this.prisma.venta.findUnique({
            where: { id: ventaId },
            include: {
                cliente: true,
                sucursal: true,
                detalles: { include: { producto: true } },
                plan: { include: { tarjeta: true, banco: true } }
            }
        });

        if (!venta) throw new NotFoundException(`La venta ${ventaId} no existe`);

        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ margin: 50, size: 'A4' });
            const buffers: Buffer[] = [];
            doc.on('data', buffer => buffers.push(buffer));
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', reject);

            this.dibujarEncabezado(doc, 'COMPROBANTE DE VENTA', `000${venta.id}`, venta.fechaCreacion);
            this.dibujarDatosCliente(doc, venta.cliente, 140);

            let y = 220;
            doc.font('Helvetica-Bold').fontSize(10);
            doc.text('Cant.', 50, y);
            doc.text('Descripción', 100, y);
            doc.text('Precio Unit.', 350, y, { width: 90, align: 'right' });
            doc.text('Subtotal', 450, y, { width: 90, align: 'right' });
            
            doc.moveTo(50, y + 15).lineTo(550, y + 15).strokeColor('#eeeeee').stroke();
            
            y += 25;
            doc.font('Helvetica').fillColor('#333333');
            
            venta.detalles.forEach(detalle => {
                doc.text(detalle.cantidad.toString(), 50, y);
                doc.text(detalle.producto.nombre, 100, y);
                doc.text(`$ ${this.formatearMoneda(Number(detalle.precioUnitario))}`, 350, y, { width: 90, align: 'right' });
                doc.text(`$ ${this.formatearMoneda(Number(detalle.subtotal))}`, 450, y, { width: 90, align: 'right' });
                y += 20;
            });

            doc.moveTo(350, y + 10).lineTo(550, y + 10).strokeColor('#cccccc').stroke();
            y += 25;
            
            const subtotalProductos = venta.detalles.reduce((acc, d) => acc + Number(d.subtotal), 0);
            const totalFinal = Number(venta.montoTotal);
            const recargo = Math.max(0, totalFinal - subtotalProductos);
            const tasaInteres = Number(venta.plan?.tasaFinanciacion || 0);

            doc.fontSize(10).font('Helvetica').fillColor('#666666');
            doc.text('Subtotal Productos:', 250, y, { width: 140, align: 'right' });
            doc.text(`$ ${this.formatearMoneda(subtotalProductos)}`, 400, y, { width: 140, align: 'right', lineBreak: false });
            y += 15;

            if (venta.modoPago === 'PLAN' && tasaInteres > 0 && recargo > 0) {
                doc.fillColor('#d93025');
                doc.text(`Recargo Plan (+${tasaInteres}%):`, 250, y, { width: 140, align: 'right' });
                doc.text(`$ ${this.formatearMoneda(recargo)}`, 400, y, { width: 140, align: 'right', lineBreak: false });
                y += 15;
            }

            y += 10;
            doc.fontSize(14).font('Helvetica-Bold').fillColor('#000000');
            doc.text('TOTAL FINAL:', 250, y, { width: 140, align: 'right' });
            doc.text(`$ ${this.formatearMoneda(totalFinal)}`, 400, y, { width: 140, align: 'right', lineBreak: false });

            if (venta.modoPago === 'PLAN' && venta.plan) {
                const cuotas = venta.plan.cantidadCuotas;
                const valorCuota = cuotas > 0 ? totalFinal / cuotas : totalFinal;

                y += 30;
                doc.fontSize(10).font('Helvetica').fillColor('#666666');
                doc.text(`Abonado con ${venta.plan.tarjeta.nombre} ${venta.plan.banco.nombre}`, 50, y);

                y += 15;
                doc.fontSize(11).font('Helvetica').fillColor('#1890ff');
                doc.text(`${cuotas} cuotas fijas de $ ${this.formatearMoneda(valorCuota)}`, 50, y);
            } else {
                y += 30;
                doc.fontSize(10).font('Helvetica').fillColor('#666666');
                doc.text('Abonado: Al Contado / Efectivo', 50, y);
            }

            if (venta.estado === 'CANCELADO') {
                y += 25;
                doc.fontSize(10).font('Helvetica-Bold').fillColor('#dc3545');
                doc.text(`VENTA CANCELADA - Motivo: ${venta.motivoCancelacion || 'No especificado'}`, 50, y);
            }

            doc.end();
        });
    }
    async generarPresupuesto(data: any): Promise<Buffer> {
        const cliente = await this.prisma.cliente.findUnique({
            where: { id: data.clienteId }
        });

        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ margin: 50, size: 'A4' });
            const buffers: Buffer[] = [];
            doc.on('data', buffer => buffers.push(buffer));
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', reject);

            this.dibujarEncabezado(doc, 'PRESUPUESTO', 'Presupuesto', new Date());
            
            if (cliente) {
                this.dibujarDatosCliente(doc, cliente, 140);
            }

            let y = 220;
            doc.font('Helvetica-Bold').fontSize(10);
            doc.text('Cant.', 50, y);
            doc.text('Descripción', 100, y);
            doc.text('Precio Unit.', 350, y, { width: 90, align: 'right' });
            doc.text('Subtotal', 450, y, { width: 90, align: 'right' });
            
            doc.moveTo(50, y + 15).lineTo(550, y + 15).strokeColor('#eeeeee').stroke();
            
            y += 25;
            doc.font('Helvetica').fillColor('#333333');
            
            data.items.forEach((item: any) => {
                doc.text(item.cantidad.toString(), 50, y);

                const detalle = item.codigo ? `${item.nombre}` : (item.nombre || 'Producto');
                doc.text(detalle, 100, y, { width: 240 });
                doc.text(`$ ${this.formatearMoneda(Number(item.precioUnitario))}`, 350, y, { width: 90, align: 'right' });
                doc.text(`$ ${this.formatearMoneda(Number(item.subtotal))}`, 450, y, { width: 90, align: 'right' });

                const alturaTexto = doc.heightOfString(detalle, { width: 240 });
                y += alturaTexto > 15 ? alturaTexto + 10 : 20;
            });

            doc.moveTo(350, y + 10).lineTo(550, y + 10).strokeColor('#cccccc').stroke();
            y += 25;

            doc.fontSize(10).font('Helvetica').fillColor('#666666');
            doc.text('Subtotal Productos:', 250, y, { width: 140, align: 'right' });
            doc.text(`$ ${this.formatearMoneda(Number(data.subtotal))}`, 400, y, { width: 140, align: 'right', lineBreak: false });
            y += 15;

            if (data.modoPago === 'PLAN' && data.tasaInteres > 0) {
                doc.fillColor('#d93025');
                doc.text(`Recargo Plan (+${data.tasaInteres}%):`, 250, y, { width: 140, align: 'right' });
                doc.text(`$ ${this.formatearMoneda(Number(data.recargo))}`, 400, y, { width: 140, align: 'right', lineBreak: false });
                y += 15;
            }

            y += 10;
            doc.fontSize(14).font('Helvetica-Bold').fillColor('#000000');
            doc.text('TOTAL FINAL:', 250, y, { width: 140, align: 'right' });
            doc.text(`$ ${this.formatearMoneda(Number(data.total))}`, 400, y, { width: 140, align: 'right', lineBreak: false });

            if (data.modoPago === 'PLAN' && data.cuotas > 1) {
                y += 30;
                doc.fontSize(11).font('Helvetica').fillColor('#1890ff');
                doc.text(`${data.cuotas} cuotas fijas de $ ${this.formatearMoneda(Number(data.valorCuota))}`, 50, y);
            }

            doc.end();
        });
    }
}