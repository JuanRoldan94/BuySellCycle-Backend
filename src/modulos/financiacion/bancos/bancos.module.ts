import { Module } from '@nestjs/common';
import { BancosService } from './bancos.service.js';
import { BancosController } from './bancos.controller.js';
import { PrismaModule } from '../../../prisma/prisma.modules.js';

@Module({
  imports: [PrismaModule],
  controllers: [BancosController],
  providers: [BancosService],
})
export class BancosModule {}
