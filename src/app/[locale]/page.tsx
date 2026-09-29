import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import { categoryIcons } from '@/lib/mock-data';
import { getCategories, getFeaturedProducts } from '@/lib/firebase/services';
import { buildPageMetadata } from '@/lib/seo';
import ProductCard from '@/components/ui/ProductCard';
import LocalBusinessJsonLd from '@/components/seo/LocalBusinessJsonLd';

export const revalidate = 3600; // ISR: revalidate every hour

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  return buildPageMetadata({
    locale,
    path: '',
    title: t('heroTitle'),
    description: t('heroSubtitle'),
  });
}


export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const tCommon = await getTranslations('common');
  const tNav = await getTranslations('nav');

  const [featuredProducts, mockCategories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <div>
      <LocalBusinessJsonLd />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white">
        <div className="container-narrow py-16 sm:py-24 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {t('heroTitle')}
            </h1>
            <p className="mt-4 text-lg text-primary-100 sm:text-xl lg:text-2xl">
              {t('heroSubtitle')}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-primary-700 shadow-sm transition hover:bg-primary-50"
              >
                {t('heroCta')}
              </Link>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '91XXXXXXXXXX'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-lg border-2 border-white/30 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                {tCommon('whatsapp')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tiles */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-narrow">
          <h2 className="text-center text-3xl font-bold text-surface-900 sm:text-4xl">
            {t('categoriesTitle')}
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {mockCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group flex flex-col items-center gap-3 rounded-xl border border-surface-200 bg-surface-50 p-6 text-center transition hover:border-primary-300 hover:bg-primary-50 hover:shadow-md"
              >
                <span className="text-4xl">{categoryIcons[cat.id] || '📦'}</span>
                <span className="text-sm font-semibold text-surface-700 group-hover:text-primary-700">
                  {cat.name[locale as Locale]}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-surface-50 py-16 sm:py-20">
        <div className="container-narrow">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-surface-900 sm:text-4xl">
              {t('featuredTitle')}
            </h2>
            <Link
              href="/products"
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              {tCommon('viewAll')} →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => {
              const category = mockCategories.find((c) => c.id === product.categoryId);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  categoryName={category?.name[locale as Locale] || ''}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-16 sm:py-24">
        <div className="container-narrow">
          <h2 className="text-center text-3xl font-bold text-surface-900 sm:text-4xl">
            {t('whyChooseTitle')}
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: t('whyQuality'), desc: t('whyQualityDesc'), icon: '🌿' },
              { title: t('whyPricing'), desc: t('whyPricingDesc'), icon: '💰' },
              { title: t('whyDelivery'), desc: t('whyDeliveryDesc'), icon: '🚛' },
              { title: t('whyExperience'), desc: t('whyExperienceDesc'), icon: '⭐' },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-surface-200 bg-surface-50 p-6 text-center transition hover:shadow-md"
              >
                <div className="mb-4 text-4xl">{item.icon}</div>
                <h3 className="text-lg font-semibold text-surface-900">{item.title}</h3>
                <p className="mt-2 text-sm text-surface-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Summary */}
      <section className="bg-surface-50 py-16">
        <div className="container-narrow">
          <div className="grid gap-6 sm:grid-cols-3">
            <a
              href={`tel:${(process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+91-XXXXXXXXXX').replace(/[^+\d]/g, '')}`}
              className="flex items-center gap-4 rounded-xl border border-surface-200 bg-white p-6 transition hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-2xl">📞</div>
              <div>
                <p className="text-sm text-surface-500">{tNav('contact')}</p>
                <p className="font-semibold text-surface-900">{process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+91-XXXXXXXXXX'}</p>
              </div>
            </a>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '91XXXXXXXXXX'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-xl border border-surface-200 bg-white p-6 transition hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl">💬</div>
              <div>
                <p className="text-sm text-surface-500">{tCommon('whatsapp')}</p>
                <p className="font-semibold text-surface-900">{tCommon('enquireNow')}</p>
              </div>
            </a>
            <a
              href={process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL || 'https://maps.google.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-xl border border-surface-200 bg-white p-6 transition hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-100 text-2xl">📍</div>
              <div>
                <p className="text-sm text-surface-500">{tCommon('directions')}</p>
                <p className="font-semibold text-surface-900">Market Yard, Pune</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="bg-primary-700 py-16 text-white sm:py-20">
        <div className="container-narrow text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">{t('ctaTitle')}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-100">
            {t('ctaSubtitle')}
          </p>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '91XXXXXXXXXX'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-semibold text-primary-700 shadow-lg transition hover:bg-primary-50"
          >
            {t('ctaButton')}
          </a>
        </div>
      </section>
    </div>
  );
}
