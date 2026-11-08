import { Controller, Get, Param, ParseIntPipe, Res, Post, Body } from '@nestjs/common';
import type { Response } from 'express';
import { PdfService } from './pdf.service.js';

@Controller('pdf')
export class PdfController {
    constructor (private readonly pdfService: PdfService){}
    
    @Post()
    async descargarPdf(
        @Body() data: any,
        @Res() res: Response
    ) {
        const buffer = await this.pdfService.generarPresupuesto(data);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=presupuesto-simulacion.pdf',
            'Content-Length': buffer.length,
        });

        res.end(buffer);
    }
    @Get('venta/:id')
    async descargarComprobante(
        @Param('id', ParseIntPipe) id: number,
        @Res() res: Response
    ) {
        const buffer = await this.pdfService.generarComprobanteVenta(id);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=comprobante-venta-${id}.pdf`,
            'Content-Length': buffer.length,
        });

        res.end(buffer);
    }

}
