import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ClientesService } from './clientes.service.js';
import { CreateClienteDto } from './dto/create-cliente.dto.js';
import { UpdateClienteDto } from './dto/update-cliente.dto.js';
import { CreateDireccionEntregaDto } from './dto/create-direccion-entrega.dto.js';
import { UpdateDireccionEntregaDto } from './dto/update-direccion-entrega.dto.js';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clientesService.create(createClienteDto);
  }

  @Get()
  findAll() {
    return this.clientesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clientesService.update(id, updateClienteDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.remove(id);
  }

  // ==========================================
  // DIRECCIONES DE ENTREGA
  // ==========================================

  @Get(':clienteId/direcciones')
  listarDirecciones(@Param('clienteId', ParseIntPipe) clienteId: number) {
    return this.clientesService.listarDirecciones(clienteId);
  }

  @Post(':clienteId/direcciones')
  crearDireccion(
    @Param('clienteId', ParseIntPipe) clienteId: number,
    @Body() dto: CreateDireccionEntregaDto
  ) {
    return this.clientesService.crearDireccion(clienteId, dto);
  }

  @Patch(':clienteId/direcciones/:id')
  actualizarDireccion(
    @Param('clienteId', ParseIntPipe) clienteId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDireccionEntregaDto
  ) {
    return this.clientesService.actualizarDireccion(clienteId, id, dto);
  }

  @Delete(':clienteId/direcciones/:id')
  eliminarDireccion(
    @Param('clienteId', ParseIntPipe) clienteId: number,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.clientesService.eliminarDireccion(clienteId, id);
  }
}
