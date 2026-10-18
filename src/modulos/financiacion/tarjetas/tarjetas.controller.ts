import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TarjetasService } from './tarjetas.service.js';
import { CreateTarjetaDto } from './dto/create-tarjeta.dto.js';
import { UpdateTarjetaDto } from './dto/update-tarjeta.dto.js';

@Controller('tarjetas')
export class TarjetasController {
  constructor(private readonly tarjetasService: TarjetasService) {}

  @Post()
  create(@Body() createTarjetaDto: CreateTarjetaDto) {
    return this.tarjetasService.create(createTarjetaDto);
  }

  @Get()
  findAll() {
    return this.tarjetasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tarjetasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTarjetaDto: UpdateTarjetaDto) {
    return this.tarjetasService.update(+id, updateTarjetaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tarjetasService.remove(+id);
  }
}
