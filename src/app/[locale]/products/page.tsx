import { Suspense } from 'react';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getAllProducts, getCategories } from '@/lib/services/product-service';
import { buildPageMetadata } from '@/lib/seo';
import ProductsPageClient from './ProductsPageClient';
import { routing } from '@/i18n/routing';

export const revalidate = 3600;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'products' });
  return buildPageMetadata({
    locale,
    path: '/products',
    title: t('pageTitle'),
    description: t('pageDescription'),
  });
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [products, categories] = await Promise.all([
    getAllProducts(),
    getCategories(),
  ]);

  return (
    <div className="container-narrow py-8 sm:py-12">
      <Suspense fallback={<div className="py-12 text-center text-surface-500">Loading products...</div>}>
        <ProductsPageClient
          products={products}
          categories={categories}
          locale={locale}
        />
      </Suspense>
    </div>
  );
}
