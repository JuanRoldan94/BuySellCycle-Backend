import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ErroresService } from './errores.service.js';
import { CreateErrorDto } from './dto/create-error.dto.js';

@Controller('errores')
export class ErroresController {
    constructor (private readonly erroresService: ErroresService) {}

    @Get()
    async obtenerErrores(@Query('tipoSistema') tipoSistema?: string) {
        return this.erroresService.listarErrores(tipoSistema);
    }

    @Post()
    async registrarError(@Body() createErrorDto: CreateErrorDto) {
        return this.erroresService.registrarError(createErrorDto);
    }
}
