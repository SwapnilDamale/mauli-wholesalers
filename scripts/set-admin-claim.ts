/**
 * One-off script to set `admin: true` custom claim on a Firebase Auth user.
 * Run using: npx tsx scripts/set-admin-claim.ts <user-uid>
 */
import { cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const uid = process.argv[2];

if (!uid) {
  console.error('Please provide a user UID: npx tsx scripts/set-admin-claim.ts <uid>');
  process.exit(1);
}

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

async function main() {
  await getAuth().setCustomUserClaims(uid, { admin: true });
  console.log(`Successfully set admin claim on user: ${uid}`);
}

main().catch(console.error);
