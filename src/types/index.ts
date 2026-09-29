import type { Locale } from '@/i18n/routing';

/** Multilingual text field stored in Firestore */
export type LocalizedText = Record<Locale, string>;

export type ProductUnit = 'kg' | 'quintal' | 'dozen' | 'box';

export type EnquiryStatus = 'new' | 'contacted' | 'closed';

/** Product document in Firestore: products/{productId} */
export interface Product {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  slug: string;
  categoryId: string;
  unit: ProductUnit;
  price: number | null;
  priceVisible: boolean;
  minWholesaleQty: number;
  images: string[];
  available: boolean;
  seasonal: boolean;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

/** Category document in Firestore: categories/{categoryId} */
export interface Category {
  id: string;
  name: LocalizedText;
  slug: string;
  enabled: boolean;
  order: number;
}

/** Enquiry document in Firestore: enquiries/{enquiryId} */
export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  productId: string | null;
  productNameSnapshot: string;
  quantity: string | null;
  message: string;
  language: Locale;
  status: EnquiryStatus;
  createdAt: Date;
}

/** Business settings (single Firestore document: settings/business) */
export interface BusinessSettings {
  businessName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  mapsUrl: string;
  hours: Record<string, string>;
  aboutText: LocalizedText;
  social: {
    instagram: string;
    facebook: string;
  };
}
