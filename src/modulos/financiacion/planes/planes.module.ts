import { Module } from '@nestjs/common';
import { PlanesService } from './planes.service.js';
import { PlanesController } from './planes.controller.js';
import { PrismaModule } from '../../../prisma/prisma.modules.js';

@Module({
  imports: [PrismaModule],
  controllers: [PlanesController],
  providers: [PlanesService],
})
export class PlanesModule {}
