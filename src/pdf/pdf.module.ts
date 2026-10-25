import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service.js';
import { PdfController } from './pdf.controller.js';
import { PrismaModule } from '../prisma/prisma.modules.js';

@Module({
  imports: [PrismaModule],
  providers: [PdfService],
  controllers: [PdfController]
})
export class PdfModule {}
