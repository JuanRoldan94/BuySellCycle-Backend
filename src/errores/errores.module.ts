import { Module } from '@nestjs/common';
import { ErroresService } from './errores.service.js';
import { ErroresController } from './errores.controller.js';
import { FirebaseModule } from '../firebase/firebase.module.js';

@Module({
  imports: [FirebaseModule] ,
  providers: [ErroresService],
  controllers: [ErroresController]
})
export class ErroresModule {}
