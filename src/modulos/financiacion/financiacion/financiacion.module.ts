import { Module } from '@nestjs/common';
import { FinanciacionService } from './financiacion.service.js';
import { FinanciacionController } from './financiacion.controller.js';
import { PrismaModule } from '../../../prisma/prisma.modules.js';

@Module({
  imports: [PrismaModule],
  providers: [FinanciacionService],
  controllers: [FinanciacionController]
})
export class FinanciacionModule {}
