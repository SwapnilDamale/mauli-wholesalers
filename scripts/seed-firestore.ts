/**
 * Firestore Seed Script
 * Seeds the Firestore database with initial products, categories, and business settings
 * from the mock data file.
 *
 * Usage:
 *   npx tsx scripts/seed-firestore.ts
 *
 * Prerequisites:
 *   - Set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY
 *     in your .env.local or environment before running.
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { mockProducts, mockCategories, mockSettings } from '../src/lib/mock-data';
import * as fs from 'fs';
import * as path from 'path';

function loadEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf-8');

  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    const value = rest.join('=').replace(/^["']|["']$/g, '');
    if (key && !process.env[key]) process.env[key] = value;
  }
}
loadEnvFile(path.join(process.cwd(), '.env.local'));

const { FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY } =
  process.env;

if (!FIREBASE_ADMIN_PROJECT_ID || !FIREBASE_ADMIN_CLIENT_EMAIL || !FIREBASE_ADMIN_PRIVATE_KEY) {
  console.error('❌  Missing Firebase Admin credentials in env. See .env.example');
  process.exit(1);
}

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

async function seed() {
  console.log('🌱  Seeding Firestore…\n');

  // Seed categories
  console.log('→ Categories…');
  const catBatch = db.batch();
  for (const cat of mockCategories) {
    const ref = db.collection('categories').doc(cat.id);
    catBatch.set(ref, cat);
  }
  await catBatch.commit();
  console.log(`  ✓ ${mockCategories.length} categories written`);

  // Seed products
  console.log('→ Products…');
  const prodBatch = db.batch();
  for (const prod of mockProducts) {
    const ref = db.collection('products').doc(prod.id);
    prodBatch.set(ref, {
      ...prod,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  await prodBatch.commit();
  console.log(`  ✓ ${mockProducts.length} products written`);

  // Seed business settings
  console.log('→ Business settings…');
  await db
    .collection('settings')
    .doc('business')
    .set({
      ...mockSettings,
      updatedAt: new Date(),
    });
  console.log('  ✓ Business settings written');

  console.log('\n✅  Seeding complete!');
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err);
  process.exit(1);
});
