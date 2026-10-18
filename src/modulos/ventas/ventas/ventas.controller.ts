import { Controller, Post, Body } from '@nestjs/common';
import { VentasService } from './ventas.service.js';
import { CrearVentaDto } from './dto/crear-venta.dto.js';

@Controller('ventas')
export class VentasController {
    constructor(private readonly ventasService: VentasService) {}

    @Post()
    async crear(@Body() crearVentaDto: CrearVentaDto){
        return await this.ventasService.registrarVenta(crearVentaDto)
    }
}
