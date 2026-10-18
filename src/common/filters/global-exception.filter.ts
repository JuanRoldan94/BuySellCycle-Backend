import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { FirebaseService } from '../../firebase/firebase.service.js'; 

@Catch() 
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly firebaseService: FirebaseService) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : exception;

    const errorLog = {
      tipoSistema: 'Backend', 
      timestamp: new Date().toISOString(),
      ruta: request.url,
      metodo: request.method,
      codigoEstado: status,
      detalle: typeof errorResponse === 'object' ? JSON.stringify(errorResponse) : String(errorResponse),
    };

    try {
      const db = this.firebaseService.getFirestore();
      await db.collection('errores').add(errorLog);
      console.log('Error capturado y guardado en Firestore');
    } catch (dbError) {
      console.error('Error crítico al intentar guardar en Firestore:', dbError);
    }

    response.status(status).json({
      statusCode: status,
      timestamp: errorLog.timestamp,
      path: request.url,
      message: exception instanceof HttpException ? (errorResponse as any).message : 'Error interno del servidor',
    });
  }
}