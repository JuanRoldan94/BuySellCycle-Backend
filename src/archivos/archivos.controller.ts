import { Controller, Post, Param, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ArchivosService } from './archivos.service.js';
import 'multer';

@Controller('archivos')
export class ArchivosController {
  constructor(private readonly archivosService: ArchivosService) {}

  @Post('subir/:carpeta') 
  @UseInterceptors(FileInterceptor('imagen')) 
  async subir(
    @UploadedFile() file: Express.Multer.File,
    @Param('carpeta') carpeta: string,
  ) {
    if (!file) {
      throw new BadRequestException('No se envió ninguna imagen');
    }

    const url = await this.archivosService.subirImagen(file, carpeta);
    
    return {
      mensaje: 'Imagen subida exitosamente',
      url: url,
    };
  }
}