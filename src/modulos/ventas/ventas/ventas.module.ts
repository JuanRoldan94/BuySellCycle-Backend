import { Module } from '@nestjs/common';
import { VentasService } from './ventas.service.js';
import { VentasController } from './ventas.controller.js';
import { PrismaModule } from '../../../prisma/prisma.modules.js';
import { MailModule } from '../../../mail/mail.module.js';

@Module({
  imports: [PrismaModule, MailModule],
  providers: [VentasService],
  controllers: [VentasController]
})
export class VentasModule {}
