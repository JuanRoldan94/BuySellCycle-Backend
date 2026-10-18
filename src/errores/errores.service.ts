import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service.js';

@Injectable()
export class ErroresService {
    constructor(private readonly firebaseService : FirebaseService) {}

    async listarErrores(tipoSistema?: string) {
        const db = this.firebaseService.getFirestore();
        let query: any = db.collection('errores');

        if (tipoSistema) {
            query = query.where('tipoSitema', '==', tipoSistema);
        }

        const snapshot = await query.get();

        const errores = snapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return errores.sort((a: any, b: any) => {
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
    }

}
