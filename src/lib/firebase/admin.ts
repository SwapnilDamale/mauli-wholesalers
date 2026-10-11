import { isFirebaseAdminConfigured } from './env';

export { isFirebaseAdminConfigured };

let adminAppInstance: any = null;

export async function getAdminApp() {
  if (!isFirebaseAdminConfigured()) {
    throw new Error(
      'Firebase Admin is not configured. Set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY.'
    );
  }

  if (adminAppInstance) {
    return adminAppInstance;
  }

  const { initializeApp, getApps, cert } = await import('firebase-admin/app');
  const existing = getApps()[0];
  if (existing) {
    adminAppInstance = existing;
    return existing;
  }

  adminAppInstance = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });

  return adminAppInstance;
}

export async function getAdminDb() {
  const app = await getAdminApp();
  const { getFirestore } = await import('firebase-admin/firestore');
  return getFirestore(app);
}

export async function getAdminAuth() {
  const app = await getAdminApp();
  const { getAuth } = await import('firebase-admin/auth');
  return getAuth(app);
}

export async function getAdminStorage() {
  const app = await getAdminApp();
  const { getStorage } = await import('firebase-admin/storage');
  return getStorage(app);
}
