import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { mockProducts } from '@/lib/mock-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mauliwholesalers.com';
  const routes = ['', '/products', '/about', '/contact', '/privacy', '/terms'];

  const staticEntries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const route of routes) {
      staticEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' || route === '/products' ? 'daily' : 'monthly',
        priority: route === '' ? 1.0 : route === '/products' ? 0.9 : 0.5,
      });
    }

    for (const product of mockProducts) {
      staticEntries.push({
        url: `${baseUrl}/${locale}/products/${product.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  return staticEntries;
}
