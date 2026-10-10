import type { Product, Category, BusinessSettings, Enquiry, EnquiryStatus } from '@/types';
import type { Locale } from '@/i18n/routing';
import { mockProducts, mockCategories, mockSettings } from '@/lib/mock-data';
import { isFirebaseAdminConfigured } from '@/lib/firebase/admin';
import { db, isFirebaseClientConfigured } from '@/lib/firebase/config';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  updateDoc,
} from 'firebase/firestore';
import { mapProduct, mapCategory, mapEnquiry, mapBusinessSettings } from '@/lib/firebase/mappers';

async function getDb() {
  const { getAdminDb } = await import('@/lib/firebase/admin');
  return getAdminDb();
}

function logDataError(context: string, error: unknown) {
  console.error(`[firestore] ${context}`, error);
}

export async function getProducts(): Promise<Product[]> {
  if (!isFirebaseAdminConfigured()) return mockProducts.filter((product) => product.available);

  try {
    const db = await getDb();
    const snapshot = await db
      .collection('products')
      .where('available', '==', true)
      .orderBy('order', 'asc')
      .get();

    return snapshot.docs.map((doc) => mapProduct(doc.id, doc.data()));
  } catch (error) {
    logDataError('getProducts', error);
    return [];
  }
}

export async function getAllProducts(): Promise<Product[]> {
  if (!isFirebaseAdminConfigured()) return mockProducts;

  try {
    const db = await getDb();
    const snapshot = await db.collection('products').orderBy('order', 'asc').get();
    return snapshot.docs.map((doc) => mapProduct(doc.id, doc.data()));
  } catch (error) {
    logDataError('getAllProducts', error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isFirebaseAdminConfigured()) {
    return mockProducts.find((product) => product.slug === slug) ?? null;
  }

  try {
    const db = await getDb();
    const snapshot = await db.collection('products').where('slug', '==', slug).limit(1).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return mapProduct(doc.id, doc.data());
  } catch (error) {
    logDataError('getProductBySlug', error);
    return null;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!isFirebaseAdminConfigured()) {
    return mockProducts.find((product) => product.id === id) ?? null;
  }

  try {
    const db = await getDb();
    const doc = await db.doc(`products/${id}`).get();
    if (!doc.exists) return null;
    return mapProduct(doc.id, doc.data() ?? {});
  } catch (error) {
    logDataError('getProductById', error);
    return null;
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  if (!isFirebaseAdminConfigured()) {
    return mockProducts.filter((product) => product.featured && product.available);
  }

  try {
    const db = await getDb();
    const snapshot = await db
      .collection('products')
      .where('featured', '==', true)
      .where('available', '==', true)
      .orderBy('order', 'asc')
      .get();

    return snapshot.docs.map((doc) => mapProduct(doc.id, doc.data()));
  } catch (error) {
    logDataError('getFeaturedProducts', error);
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  if (!isFirebaseAdminConfigured()) {
    return mockCategories.filter((category) => category.enabled);
  }

  try {
    const db = await getDb();
    const snapshot = await db
      .collection('categories')
      .where('enabled', '==', true)
      .orderBy('order', 'asc')
      .get();

    return snapshot.docs.map((doc) => mapCategory(doc.id, doc.data()));
  } catch (error) {
    logDataError('getCategories', error);
    return [];
  }
}

export async function getAllCategories(): Promise<Category[]> {
  if (!isFirebaseAdminConfigured()) return mockCategories;

  try {
    const db = await getDb();
    const snapshot = await db.collection('categories').orderBy('order', 'asc').get();
    return snapshot.docs.map((doc) => mapCategory(doc.id, doc.data()));
  } catch (error) {
    logDataError('getAllCategories', error);
    return [];
  }
}

export async function getBusinessSettings(): Promise<BusinessSettings> {
  if (isFirebaseAdminConfigured()) {
    try {
      const db = await getDb();
      const doc = await db.doc('settings/business').get();
      if (doc.exists) return mapBusinessSettings(doc.data() ?? {});
    } catch (error) {
      logDataError('getBusinessSettings (admin)', error);
    }
  }

  if (isFirebaseClientConfigured()) {
    try {
      const docSnap = await getDoc(doc(db, 'settings', 'business'));
      if (docSnap.exists()) {
        return mapBusinessSettings(docSnap.data());
      }
    } catch (error) {
      logDataError('getBusinessSettings (client)', error);
    }
  }

  return mockSettings;
}

export async function saveBusinessSettings(data: BusinessSettings): Promise<void> {
  if (isFirebaseAdminConfigured()) {
    const adminDb = await getDb();
    await adminDb.doc('settings/business').set(data, { merge: true });
    return;
  }

  if (isFirebaseClientConfigured()) {
    try {
      await setDoc(doc(db, 'settings', 'business'), data, { merge: true });
    } catch (err) {
      // In Spark plan, client-side setDoc in AdminSettingsClient performs the authenticated write.
      logDataError('saveBusinessSettings (client)', err);
    }
  }
}

export interface CreateEnquiryData {
  name: string;
  phone: string;
  email: string | null;
  productId: string | null;
  productNameSnapshot: string;
  quantity: string | null;
  message: string;
  language: Locale;
}

export async function createEnquiry(data: CreateEnquiryData): Promise<string> {
  if (isFirebaseAdminConfigured()) {
    try {
      const adminDb = await getDb();
      const { FieldValue } = await import('firebase-admin/firestore');
      const docRef = await adminDb.collection('enquiries').add({
        name: data.name,
        phone: data.phone,
        email: data.email,
        productId: data.productId,
        productNameSnapshot: data.productNameSnapshot,
        quantity: data.quantity,
        message: data.message,
        language: data.language,
        createdAt: FieldValue.serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      logDataError('createEnquiry (admin)', err);
    }
  }

  if (isFirebaseClientConfigured()) {
    try {
      const docRef = await addDoc(collection(db, 'enquiries'), {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        productId: data.productId || null,
        productNameSnapshot: data.productNameSnapshot || '',
        quantity: data.quantity || null,
        message: data.message,
        language: data.language,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      logDataError('createEnquiry (client)', err);
    }
  }

  console.info('[mock] Enquiry submitted:', data);
  return 'mock-enquiry-id';
}

export async function getEnquiries(status?: EnquiryStatus): Promise<Enquiry[]> {
  if (isFirebaseAdminConfigured()) {
    try {
      const adminDb = await getDb();
      let query = adminDb.collection('enquiries').orderBy('createdAt', 'desc');
      if (status) {
        query = adminDb
          .collection('enquiries')
          .where('status', '==', status)
          .orderBy('createdAt', 'desc');
      }
      const snapshot = await query.limit(100).get();
      return snapshot.docs.map((doc) => mapEnquiry(doc.id, doc.data()));
    } catch (error) {
      logDataError('getEnquiries (admin)', error);
      return [];
    }
  }

  if (isFirebaseClientConfigured()) {
    try {
      let q = query(collection(db, 'enquiries'), orderBy('createdAt', 'desc'), limit(100));
      if (status) {
        q = query(
          collection(db, 'enquiries'),
          where('status', '==', status),
          orderBy('createdAt', 'desc'),
          limit(100)
        );
      }
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => mapEnquiry(doc.id, doc.data()));
    } catch (error) {
      logDataError('getEnquiries (client)', error);
      return [];
    }
  }

  return [];
}

export async function updateEnquiryStatus(
  id: string,
  status: EnquiryStatus
): Promise<void> {
  if (isFirebaseAdminConfigured()) {
    const adminDb = await getDb();
    await adminDb.doc(`enquiries/${id}`).update({ status });
    return;
  }

  if (isFirebaseClientConfigured()) {
    try {
      await updateDoc(doc(db, 'enquiries', id), { status });
    } catch (err) {
      logDataError('updateEnquiryStatus (client)', err);
    }
  }
}
