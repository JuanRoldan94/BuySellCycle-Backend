import { Controller, Get, Query } from '@nestjs/common';
import { ErroresService } from './errores.service.js';

@Controller('errores')
export class ErroresController {
    constructor (private readonly erroresService: ErroresService) {}

    @Get()
    async obtenerErrores(@Query('tipoSistema') tipoSistema?:string) {
        return this.erroresService.listarErrores(tipoSistema);
    }
}
