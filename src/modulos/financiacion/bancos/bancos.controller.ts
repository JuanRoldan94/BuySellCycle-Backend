import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BancosService } from './bancos.service.js';
import { CreateBancoDto } from './dto/create-banco.dto.js';
import { UpdateBancoDto } from './dto/update-banco.dto.js';

@Controller('bancos')
export class BancosController {
  constructor(private readonly bancosService: BancosService) {}

  @Post()
  create(@Body() createBancoDto: CreateBancoDto) {
    return this.bancosService.create(createBancoDto);
  }

  @Get()
  findAll() {
    return this.bancosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bancosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBancoDto: UpdateBancoDto) {
    return this.bancosService.update(+id, updateBancoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bancosService.remove(+id);
  }
}
