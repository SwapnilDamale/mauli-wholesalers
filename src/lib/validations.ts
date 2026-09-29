import { z } from 'zod';

const emptyToNull = (value: string | null | undefined) => {
  if (!value || value.trim() === '') return null;
  return value;
};

export const enquirySchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  phone: z.string().trim().min(10, 'Phone must be at least 10 digits').max(20),
  email: z.preprocess(
    (value) => {
      if (typeof value !== 'string') return null;
      const trimmed = value.trim();
      return trimmed === '' ? null : trimmed;
    },
    z.string().email('Invalid email').nullable()
  ),
  productId: z.string().trim().max(100).optional().transform(emptyToNull),
  productNameSnapshot: z.string().max(200).default(''),
  quantity: z.string().trim().max(100).optional().transform(emptyToNull),
  message: z.string().trim().min(1, 'Message is required').max(2000),
  language: z.enum(['en', 'hi', 'mr']),
  website: z.string().max(0, 'Bot detected').optional().default(''),
});

export type EnquiryFormData = z.infer<typeof enquirySchema>;

export const productSchema = z.object({
  name: z.object({
    en: z.string().min(1).max(200),
    hi: z.string().min(1).max(200),
    mr: z.string().min(1).max(200),
  }),
  description: z.object({
    en: z.string().min(1).max(4000),
    hi: z.string().min(1).max(4000),
    mr: z.string().min(1).max(4000),
  }),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  categoryId: z.string().min(1).max(100),
  unit: z.enum(['kg', 'quintal', 'dozen', 'box']),
  price: z.number().nonnegative().nullable(),
  priceVisible: z.boolean(),
  minWholesaleQty: z.number().int().positive(),
  images: z.array(z.string().max(2000)).max(20).default([]),
  available: z.boolean(),
  seasonal: z.boolean(),
  featured: z.boolean(),
  order: z.number().int().nonnegative(),
});

export const categorySchema = z.object({
  name: z.object({
    en: z.string().min(1).max(200),
    hi: z.string().min(1).max(200),
    mr: z.string().min(1).max(200),
  }),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  enabled: z.boolean(),
  order: z.number().int().nonnegative(),
});

export const settingsSchema = z.object({
  businessName: z.string().min(1).max(200),
  phone: z.string().min(1).max(40),
  whatsapp: z.string().min(1).max(20),
  email: z.string().email(),
  address: z.string().min(1).max(500),
  mapsUrl: z.string().url().max(1000),
  hours: z.record(z.string(), z.string()),
  aboutText: z.object({
    en: z.string().max(8000),
    hi: z.string().max(8000),
    mr: z.string().max(8000),
  }),
  social: z.object({
    instagram: z.string().max(500),
    facebook: z.string().max(500),
  }),
});
