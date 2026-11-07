import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service.js';

@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService) {}

    @Post('presupuesto')
    async enviarPresupuesto(@Body() data: any) {
        return this.mailService.enviarPresupuesto(data);
    }
}