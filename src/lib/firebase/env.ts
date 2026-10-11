/**
 * Lightweight environment checker for Firebase Admin configuration.
 * Kept completely isolated from firebase-admin imports so it never
 * pulls in Node ESM/CJS dependencies (like jose / jwks-rsa) at runtime.
 */
export function isFirebaseAdminConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_ADMIN_PROJECT_ID &&
      process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
      process.env.FIREBASE_ADMIN_PRIVATE_KEY
  );
}
