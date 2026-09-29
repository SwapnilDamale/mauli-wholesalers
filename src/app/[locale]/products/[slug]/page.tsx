import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getProductBySlug, getCategories } from '@/lib/firebase/services';
import { unitLabels, mockProducts } from '@/lib/mock-data';
import { routing, Link } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import { buildPageMetadata } from '@/lib/seo';
import ImageGallery from '@/components/ui/ImageGallery';
import Badge from '@/components/ui/Badge';
import ProductJsonLd from '@/components/seo/ProductJsonLd';

export const revalidate = 3600;

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    mockProducts.map((product) => ({ locale, slug: product.slug }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Product Not Found' };
  return buildPageMetadata({
    locale,
    path: `/products/${slug}`,
    title: product.name[locale as Locale],
    description: product.description[locale as Locale],
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [product, categories] = await Promise.all([
    getProductBySlug(slug),
    getCategories(),
  ]);

  if (!product) notFound();

  const category = categories.find((c) => c.id === product.categoryId);
  const t = await getTranslations('products');
  const tCommon = await getTranslations('common');
  const tNav = await getTranslations('nav');
  const tWhatsapp = await getTranslations('whatsapp');

  const loc = locale as Locale;
  const productName = product.name[loc];
  const whatsappMessage = encodeURIComponent(tWhatsapp('productMessage', { product: productName }));
  const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '91XXXXXXXXXX'}?text=${whatsappMessage}`;
  const unitLabel = unitLabels[product.unit]?.[loc] || product.unit;

  return (
    <div className="container-narrow py-8 sm:py-12">
      <ProductJsonLd product={product} locale={loc} />
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-surface-500">
        <Link href="/" className="hover:text-primary-600">{tNav('home')}</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary-600">{tNav('products')}</Link>
        <span>/</span>
        <span className="text-surface-900">{productName}</span>
      </nav>

      <Link href="/products" className="mb-6 inline-flex items-center text-sm text-primary-600 hover:underline">
        ← {t('backToProducts')}
      </Link>

      <div className="mt-4 grid gap-8 md:grid-cols-2 lg:gap-12">
        <ImageGallery images={product.images} alt={productName} />

        <div>
          {category && (
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary-600">
              {category.name[loc]}
            </p>
          )}
          <h1 className="mb-4 text-3xl font-bold text-surface-900 sm:text-4xl">{productName}</h1>

          <div className="mb-6 flex flex-wrap gap-2">
            <Badge variant={product.available ? 'available' : 'outOfStock'}>
              {product.available ? tCommon('available') : tCommon('outOfStock')}
            </Badge>
            {product.seasonal && <Badge variant="seasonal">{tCommon('seasonal')}</Badge>}
            {product.featured && <Badge variant="featured">{tCommon('featured')}</Badge>}
          </div>

          <div className="mb-6 text-2xl font-bold text-surface-900">
            {product.priceVisible && product.price != null ? (
              <>₹{product.price} <span className="text-base font-normal text-surface-500">/ {unitLabel}</span></>
            ) : (
              <span className="text-lg text-secondary-600">{tCommon('enquireForPrice')}</span>
            )}
          </div>

          <div className="mb-8 space-y-4 border-t border-b border-surface-200 py-6">
            <p className="text-lg text-surface-600">{product.description[loc]}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-surface-500">{t('minimumOrder')}</span>
                <p className="font-semibold text-surface-900">{product.minWholesaleQty} {unitLabel}</p>
              </div>
              <div>
                <span className="text-surface-500">{t('unit')}</span>
                <p className="font-semibold text-surface-900">{unitLabel}</p>
              </div>
              <div>
                <span className="text-surface-500">{t('category')}</span>
                <p className="font-semibold text-surface-900">{category?.name[loc] || '-'}</p>
              </div>
              <div>
                <span className="text-surface-500">{t('availability')}</span>
                <p className="font-semibold text-surface-900">
                  {product.available ? tCommon('available') : tCommon('outOfStock')}
                </p>
              </div>
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-8 py-4 text-lg font-bold text-white shadow-md transition hover:bg-green-700"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 0 0 .612.638l4.697-1.386A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.319 0-4.476-.756-6.209-2.037l-.344-.27-3.57 1.054 1.088-3.432-.296-.37A9.935 9.935 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
            </svg>
            {t('whatsappEnquiry')}
          </a>
        </div>
      </div>
    </div>
  );
}
