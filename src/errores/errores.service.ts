import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service.js';
import { CreateErrorDto } from './dto/create-error.dto.js';

@Injectable()
export class ErroresService {
    constructor(private readonly firebaseService: FirebaseService) {}

    async registrarError(data: CreateErrorDto) {
        const db = this.firebaseService.getFirestore();
        if (!db) {
            throw new Error('No se pudo obtener la instancia de Firestore');
        }

        const errorLog = {
            tipoSistema: data.tipoSistema || 'Frontend',
            timestamp: data.timestamp || new Date().toISOString(),
            ruta: data.ruta,
            metodo: data.metodo || 'GET',
            codigoEstado: data.codigoEstado ?? 404,
            detalle: data.detalle,
        };

        const docRef = await db.collection('errores').add(errorLog);
        console.log(`[ErroresService] Error registrado en Firestore (ID: ${docRef.id}): [${errorLog.tipoSistema}] ${errorLog.ruta}`);
        return {
            id: docRef.id,
            ...errorLog,
        };
    }

    async listarErrores(tipoSistema?: string) {
        const db = this.firebaseService.getFirestore();
        if (!db) {
            throw new Error('No se pudo obtener la instancia de Firestore');
        }

        const snapshot = await db.collection('errores').get();

        let errores = snapshot.docs.map((doc: any) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                tipoSistema: data.tipoSistema || data.tipoSitema,
            };
        });

        if (tipoSistema) {
            errores = errores.filter(
                (e: any) => e.tipoSistema?.toLowerCase() === tipoSistema.toLowerCase()
            );
        }

        return errores.sort((a: any, b: any) => {
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
    }
}
