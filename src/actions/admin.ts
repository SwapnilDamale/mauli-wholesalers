'use server';

import { revalidatePath } from 'next/cache';
import { productSchema, categorySchema, settingsSchema } from '@/lib/validations';
import type { Product, Category, BusinessSettings } from '@/types';
import { mockProducts, mockCategories, mockSettings } from '@/lib/mock-data';

function isFirebaseConfigured(): boolean {
  return !!(
    process.env.FIREBASE_ADMIN_PROJECT_ID &&
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
    process.env.FIREBASE_ADMIN_PRIVATE_KEY
  );
}

async function getDb() {
  const { getAdminDb } = await import('@/lib/firebase/admin');
  return getAdminDb();
}

// In-memory fallback stores for local dev when Firebase isn't configured
let localProducts = [...mockProducts];
let localCategories = [...mockCategories];
let localSettings = { ...mockSettings };

// --- PRODUCTS CRUD ---

export async function saveProductAction(data: Partial<Product>): Promise<{ success: boolean; error?: string }> {
  try {
    const isNew = !data.id;
    const docData = {
      name: data.name,
      description: data.description,
      slug: data.slug,
      categoryId: data.categoryId,
      unit: data.unit || 'kg',
      price: data.price ?? null,
      priceVisible: data.priceVisible ?? true,
      minWholesaleQty: data.minWholesaleQty ?? 1,
      images: data.images || [],
      available: data.available ?? true,
      seasonal: data.seasonal ?? false,
      featured: data.featured ?? false,
      order: data.order ?? 1,
      updatedAt: new Date(),
    };

    if (isFirebaseConfigured()) {
      const db = await getDb();
      if (isNew) {
        await db.collection('products').add({
          ...docData,
          createdAt: new Date(),
        });
      } else {
        await db.collection('products').doc(data.id!).update(docData);
      }
    } else {
      if (isNew) {
        const newProduct: Product = {
          id: `prod_${Date.now()}`,
          ...docData,
          createdAt: new Date(),
        } as Product;
        localProducts.push(newProduct);
      } else {
        localProducts = localProducts.map((p) =>
          p.id === data.id ? ({ ...p, ...docData } as Product) : p
        );
      }
    }

    revalidatePath('/[locale]/products', 'page');
    revalidatePath('/[locale]', 'page');
    return { success: true };
  } catch (err: any) {
    console.error('saveProductAction error:', err);
    return { success: false, error: err.message || 'Failed to save product' };
  }
}

export async function deleteProductAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (isFirebaseConfigured()) {
      const db = await getDb();
      await db.collection('products').doc(id).delete();
    } else {
      localProducts = localProducts.filter((p) => p.id !== id);
    }
    revalidatePath('/[locale]/products', 'page');
    revalidatePath('/[locale]', 'page');
    return { success: true };
  } catch (err: any) {
    console.error('deleteProductAction error:', err);
    return { success: false, error: err.message || 'Failed to delete product' };
  }
}

// --- CATEGORIES CRUD ---

export async function saveCategoryAction(data: Partial<Category>): Promise<{ success: boolean; error?: string }> {
  try {
    const isNew = !data.id;
    const docData = {
      name: data.name,
      slug: data.slug,
      enabled: data.enabled ?? true,
      order: data.order ?? 1,
    };

    if (isFirebaseConfigured()) {
      const db = await getDb();
      if (isNew) {
        await db.collection('categories').add(docData);
      } else {
        await db.collection('categories').doc(data.id!).update(docData);
      }
    } else {
      if (isNew) {
        const newCat: Category = {
          id: `cat_${Date.now()}`,
          ...docData,
        } as Category;
        localCategories.push(newCat);
      } else {
        localCategories = localCategories.map((c) =>
          c.id === data.id ? ({ ...c, ...docData } as Category) : c
        );
      }
    }

    revalidatePath('/[locale]/products', 'page');
    return { success: true };
  } catch (err: any) {
    console.error('saveCategoryAction error:', err);
    return { success: false, error: err.message || 'Failed to save category' };
  }
}

export async function deleteCategoryAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (isFirebaseConfigured()) {
      const db = await getDb();
      await db.collection('categories').doc(id).delete();
    } else {
      localCategories = localCategories.filter((c) => c.id !== id);
    }
    revalidatePath('/[locale]/products', 'page');
    return { success: true };
  } catch (err: any) {
    console.error('deleteCategoryAction error:', err);
    return { success: false, error: err.message || 'Failed to delete category' };
  }
}

// --- SETTINGS CRUD ---

export async function saveSettingsAction(data: BusinessSettings): Promise<{ success: boolean; error?: string }> {
  try {
    if (isFirebaseConfigured()) {
      const db = await getDb();
      await db.doc('settings/business').set(data, { merge: true });
    } else {
      localSettings = { ...data };
    }
    revalidatePath('/[locale]', 'layout');
    return { success: true };
  } catch (err: any) {
    console.error('saveSettingsAction error:', err);
    return { success: false, error: err.message || 'Failed to save settings' };
  }
}

// --- ENQUIRIES STATUS UPDATE ---

export async function updateEnquiryStatusAction(
  id: string,
  status: 'new' | 'contacted' | 'closed'
): Promise<{ success: boolean; error?: string }> {
  try {
    if (isFirebaseConfigured()) {
      const db = await getDb();
      await db.doc(`enquiries/${id}`).update({ status });
    }
    revalidatePath('/admin/enquiries');
    return { success: true };
  } catch (err: any) {
    console.error('updateEnquiryStatusAction error:', err);
    return { success: false, error: err.message || 'Failed to update enquiry status' };
  }
}
