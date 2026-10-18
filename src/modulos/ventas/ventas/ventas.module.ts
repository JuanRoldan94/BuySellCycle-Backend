import { Module } from '@nestjs/common';
import { VentasService } from './ventas.service.js';
import { VentasController } from './ventas.controller.js';
import { PrismaModule } from '../../../prisma/prisma.modules.js';

@Module({
  imports: [PrismaModule],
  providers: [VentasService],
  controllers: [VentasController]
})
export class VentasModule {}
