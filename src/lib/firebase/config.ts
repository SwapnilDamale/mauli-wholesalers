import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

export function getFirebaseConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyAXDD-Uv5Kjp2SMARqqZEIgfpRwtBde9pc',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'mauli-wholesalers-ffa0f.firebaseapp.com',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'mauli-wholesalers-ffa0f',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'mauli-wholesalers-ffa0f.firebasestorage.app',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '428108647620',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:428108647620:web:74d859dfa853ab5d070d91',
  };
}

export function isFirebaseClientConfigured(): boolean {
  return true;
}

export function getClientApp(): FirebaseApp {
  const existing = getApps()[0];
  if (existing) return existing;
  return initializeApp(getFirebaseConfig());
}

export function getClientAuth(): Auth {
  return getAuth(getClientApp());
}

export function getClientDb(): Firestore {
  return getFirestore(getClientApp());
}

export function getClientStorage(): FirebaseStorage {
  return getStorage(getClientApp());
}

export const app = getClientApp();
export const auth: Auth = getClientAuth();
export const db: Firestore = getClientDb();
export const storage: FirebaseStorage = getClientStorage();

export default app;
