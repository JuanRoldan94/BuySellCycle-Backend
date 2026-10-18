import { Module } from '@nestjs/common';
import { ErroresService } from './errores.service.js';
import { ErroresController } from './errores.controller.js';

@Module({
  providers: [ErroresService],
  controllers: [ErroresController]
})
export class ErroresModule {}
