import { Injectable, OnModuleInit } from '@nestjs/common';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private firestore: Firestore;
  public storage: ReturnType<typeof getStorage>;

  onModuleInit() {
    if (getApps().length === 0) {
      initializeApp({
        projectId: 'demo-no-project',
        storageBucket: 'demo-no-project.appspot.com',
      });
    }
    
    this.firestore = getFirestore();
    this.storage = getStorage();
  }

  getFirestore() {
    return this.firestore;
  }

  getStorageBucket(): any {
    return this.storage.bucket();
  }
}