import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mauliwholesalers.com';
const SITE_NAME = 'Mauli Wholesalers';

/** Locale → human-readable language tag for hreflang */
const hreflangMap: Record<Locale, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
};

/**
 * Build standard Next.js metadata for a localized route.
 * Adds canonical + hreflang alternates across all three locales.
 */
export function buildPageMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: string;
  /** e.g. '' for home, '/products', '/products/onion' */
  path: string;
  title: string;
  description: string;
}): Metadata {
  const canonical = `${SITE_URL}/${locale}${path}`;

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[hreflangMap[loc]] = `${SITE_URL}/${loc}${path}`;
  }
  languages['x-default'] = `${SITE_URL}/en${path}`;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: hreflangMap[locale as Locale] || locale,
      type: 'website',
    },
  };
}
