import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PresupuestosService } from './presupuestos.service.js';
import { CreatePresupuestoDto } from './dto/create-presupuesto.dto.js';

@Controller('presupuestos')
export class PresupuestosController {
  constructor(private readonly presupuestosService: PresupuestosService) {}

  @Post()
  create(@Body() createPresupuestoDto: CreatePresupuestoDto) {
    return this.presupuestosService.create(createPresupuestoDto);
  }
}
