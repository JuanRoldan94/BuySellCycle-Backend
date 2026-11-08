import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { FirebaseService } from '../../firebase/firebase.service.js';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly firebaseService: FirebaseService) { }

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

    let detalleFormateado: string;
    if (status === HttpStatus.NOT_FOUND) {
      const mensajeOriginal =
        typeof errorResponse === 'object' && errorResponse !== null
          ? (errorResponse as any).message || JSON.stringify(errorResponse)
          : String(errorResponse);

      detalleFormateado = `Intento de acceso a endpoint inexistente [${request.method} ${request.url}]: ${mensajeOriginal}`;
    } else {
      detalleFormateado =
        typeof errorResponse === 'object' ? JSON.stringify(errorResponse) : String(errorResponse);
    }

    const errorLog = {
      tipoSistema: 'Backend',
      timestamp: new Date().toISOString(),
      ruta: request.url,
      metodo: request.method,
      codigoEstado: status,
      detalle: detalleFormateado,
    };

    try {
      const db = this.firebaseService.getFirestore();
      if (db) {
        const docRef = await db.collection('errores').add(errorLog);
        console.log(`Error capturado y guardado en Firestore`);
      } else {
        console.warn('No se pudo obtener la instancia de Firestore');
      }
    } catch (dbError: any) {
      console.error('No se pudo guardar el error en Firestore:', dbError?.message || dbError);
    }

    response.status(status).json({
      statusCode: status,
      timestamp: errorLog.timestamp,
      path: request.url,
      message: exception instanceof HttpException ? (errorResponse as any).message : 'Error interno del servidor',
    });
  }
}