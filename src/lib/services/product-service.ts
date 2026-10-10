/**
 * Product Service — clean abstraction over product/category data.
 *
 * Currently backed by mock data. To switch to Supabase or Firebase,
 * replace the implementations below — the interface stays the same.
 */

import type { Product, Category, BusinessSettings } from '@/types';
import { mockProducts, mockCategories, mockSettings } from '@/lib/mock-data';

// ─── Products ────────────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  return mockProducts.filter((p) => p.available).sort((a, b) => a.order - b.order);
}

export async function getAllProducts(): Promise<Product[]> {
  return [...mockProducts].sort((a, b) => a.order - b.order);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return mockProducts.find((p) => p.slug === slug) ?? null;
}

export async function getProductById(id: string): Promise<Product | null> {
  return mockProducts.find((p) => p.id === id) ?? null;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return mockProducts
    .filter((p) => p.featured && p.available)
    .sort((a, b) => a.order - b.order);
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  return mockProducts
    .filter((p) => p.categoryId === categoryId && p.available)
    .sort((a, b) => a.order - b.order);
}

// ─── Categories ──────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  return mockCategories.filter((c) => c.enabled).sort((a, b) => a.order - b.order);
}

export async function getAllCategories(): Promise<Category[]> {
  return [...mockCategories].sort((a, b) => a.order - b.order);
}

// ─── Business Settings ──────────────────────────────────────────

export async function getBusinessSettings(): Promise<BusinessSettings> {
  return mockSettings;
}
