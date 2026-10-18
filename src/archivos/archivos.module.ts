import { Module } from '@nestjs/common';
import { ArchivosService } from './archivos.service.js';
import { ArchivosController } from './archivos.controller.js';
import { FirebaseModule } from '../firebase/firebase.module.js';

@Module({
  imports: [FirebaseModule], 
  controllers: [ArchivosController],
  providers: [ArchivosService]
})
export class ArchivosModule {}