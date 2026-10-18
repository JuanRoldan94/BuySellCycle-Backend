import { Module } from '@nestjs/common';
import { TarjetasService } from './tarjetas.service.js';
import { TarjetasController } from './tarjetas.controller.js';
import { PrismaModule } from '../../../prisma/prisma.modules.js';

@Module({
  imports: [PrismaModule],
  controllers: [TarjetasController],
  providers: [TarjetasService],
})
export class TarjetasModule {}
