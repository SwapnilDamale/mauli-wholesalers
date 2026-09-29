import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { getProducts, getCategories } from '@/lib/firebase/services';
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
    getProducts(),
    getCategories(),
  ]);

  return (
    <div className="container-narrow py-8 sm:py-12">
      <ProductsPageClient
        products={products}
        categories={categories}
        locale={locale}
      />
    </div>
  );
}
