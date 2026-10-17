import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service.js';

@Module({
  providers: [FirebaseService]
})
export class FirebaseModule {}
