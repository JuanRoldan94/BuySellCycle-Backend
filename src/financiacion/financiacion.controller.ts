import { Controller, Post, Body } from '@nestjs/common';
import { FinanciacionService } from './financiacion.service.js';
import { SimularFinanciacionDto } from './dto/simular-financiacion.dto.js';

@Controller('financiacion')
export class FinanciacionController {
  constructor(private readonly financiacionService: FinanciacionService) {}

  @Post('simular')
  async simular(@Body() datosSimulacion: SimularFinanciacionDto) {
    return await this.financiacionService.simularCuotas(datosSimulacion);
  }
}