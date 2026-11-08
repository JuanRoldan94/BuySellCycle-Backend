import { Controller, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { MailService } from './mail.service.js';

@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService) {}

    @Post('presupuesto')
    async enviarPresupuesto(@Body() data: any) {
        return this.mailService.enviarPresupuesto(data);
    }

    @Post('venta/:id')
    async enviarVenta(@Param('id', ParseIntPipe) id: number) {
        return this.mailService.enviarComprobanteVenta(id);
    }
}