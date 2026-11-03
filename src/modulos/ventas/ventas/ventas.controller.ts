import { Controller, Post, Get, Patch, Body, Param, ParseIntPipe } from '@nestjs/common';
import { VentasService } from './ventas.service.js';
import { CrearVentaDto } from './dto/crear-venta.dto.js';
import { ActualizarEstadoVentaDto } from './dto/actualizar-estado-venta.dto.js';

@Controller('ventas')
export class VentasController {
    constructor(private readonly ventasService: VentasService) {}

    @Post()
    async crear(@Body() crearVentaDto: CrearVentaDto){
        return await this.ventasService.registrarVenta(crearVentaDto)
    }

    @Get()
    async obtenerTodas(){
        return await this.ventasService.findAll();
    }
    
    @Patch(':id/estado')
    async cambiarEstado(
        @Param('id', ParseIntPipe) id: number,
        @Body() actualizarEstadoVentaDto: ActualizarEstadoVentaDto,
    ) {
        return await this.ventasService.actualizarEstado(id, actualizarEstadoVentaDto.estado);
    }
}
