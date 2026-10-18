import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service.js';
import sharp from 'sharp'

@Injectable()
export class ArchivosService {
    constructor (private readonly firebase: FirebaseService) {}

    async subirImagen(file: Express.Multer.File, carpeta: string): Promise<string> {
        const bufferOptimizado = await sharp(file.buffer)
            .resize({ width: 800, withoutEnlargement: true }) 
            .webp({ quality: 80 })
            .toBuffer();

        const nombreArchivo = `${carpeta}/${Date.now()}-opt.webp`;
        
        const bucket = this.firebase.getStorageBucket();
        const archivoFirebase = bucket.file(nombreArchivo);

        await archivoFirebase.save(bufferOptimizado, {
            metadata: { contentType: 'image/webp'},
        });

        const urlPublica = `http://127.0.0.1:9199/v0/b/${bucket.name}/o/${encodeURIComponent(nombreArchivo)}?alt=media`;
        return urlPublica;
    }
}
