import type { DocumentData } from 'firebase-admin/firestore';
import type { Product, Category, Enquiry, BusinessSettings, LocalizedText } from '@/types';
import { locales, type Locale } from '@/i18n/routing';

function toDate(value: unknown): Date {
  if (value instanceof Date) return value;
  if (value && typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
    return value.toDate() as Date;
  }
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date();
}

function toLocalizedText(value: unknown, fallback = ''): LocalizedText {
  const record = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>;
  const text = {} as LocalizedText;
  for (const locale of locales) {
    const entry = record[locale];
    text[locale] = typeof entry === 'string' ? entry : fallback;
  }
  return text;
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asNullableString(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

const UNITS = ['kg', 'quintal', 'dozen', 'box'] as const;

export function mapProduct(id: string, data: DocumentData): Product {
  const unit = UNITS.includes(data.unit) ? data.unit : 'kg';
  return {
    id,
    name: toLocalizedText(data.name),
    description: toLocalizedText(data.description),
    slug: asString(data.slug, id),
    categoryId: asString(data.categoryId),
    unit,
    price: typeof data.price === 'number' ? data.price : null,
    priceVisible: asBoolean(data.priceVisible),
    minWholesaleQty: asNumber(data.minWholesaleQty, 1),
    images: Array.isArray(data.images)
      ? data.images.filter((item: unknown): item is string => typeof item === 'string')
      : [],
    available: asBoolean(data.available, true),
    seasonal: asBoolean(data.seasonal),
    featured: asBoolean(data.featured),
    order: asNumber(data.order),
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

export function mapCategory(id: string, data: DocumentData): Category {
  return {
    id,
    name: toLocalizedText(data.name),
    slug: asString(data.slug, id),
    enabled: asBoolean(data.enabled, true),
    order: asNumber(data.order),
  };
}

export function mapEnquiry(id: string, data: DocumentData): Enquiry {
  const language = locales.includes(data.language as Locale)
    ? (data.language as Locale)
    : 'en';
  const status =
    data.status === 'contacted' || data.status === 'closed' ? data.status : 'new';

  return {
    id,
    name: asString(data.name),
    phone: asString(data.phone),
    email: asNullableString(data.email),
    productId: asNullableString(data.productId),
    productNameSnapshot: asString(data.productNameSnapshot),
    quantity: asNullableString(data.quantity),
    message: asString(data.message),
    language,
    status,
    createdAt: toDate(data.createdAt),
  };
}

export function mapBusinessSettings(data: DocumentData): BusinessSettings {
  const hoursRaw = data.hours && typeof data.hours === 'object' ? data.hours : {};
  const hours: Record<string, string> = {};
  for (const [key, value] of Object.entries(hoursRaw as Record<string, unknown>)) {
    if (typeof value === 'string') hours[key] = value;
  }

  const social = (data.social && typeof data.social === 'object' ? data.social : {}) as Record<
    string,
    unknown
  >;

  return {
    businessName: asString(data.businessName, 'Mauli Wholesalers'),
    phone: asString(data.phone),
    whatsapp: asString(data.whatsapp),
    email: asString(data.email),
    address: asString(data.address),
    mapsUrl: asString(data.mapsUrl),
    hours,
    aboutText: toLocalizedText(data.aboutText),
    social: {
      instagram: asString(social.instagram),
      facebook: asString(social.facebook),
    },
  };
}
