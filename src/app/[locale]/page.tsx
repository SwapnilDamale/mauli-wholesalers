import { setRequestLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import { categoryIcons, categoryImages } from '@/lib/mock-data';
import { getCategories, getFeaturedProducts, getBusinessSettings } from '@/lib/services/product-service';
import { getGeneralWhatsAppUrl, getPhoneNumber, getPhoneTelUrl, getMapsUrl } from '@/lib/whatsapp';
import { buildPageMetadata } from '@/lib/seo';
import ProductCard from '@/components/ui/ProductCard';
import LocalBusinessJsonLd from '@/components/seo/LocalBusinessJsonLd';

export const revalidate = 3600;

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

  const loc = locale as Locale;
  const [featuredProducts, categories, settings] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getBusinessSettings(),
  ]);

  const whatsappUrl = getGeneralWhatsAppUrl(loc, settings.whatsapp);
  const phone = getPhoneNumber(settings.phone);
  const phoneTel = getPhoneTelUrl(settings.phone);
  const mapsUrl = getMapsUrl(settings.mapsUrl);

  return (
    <div>
      <LocalBusinessJsonLd />

      {/* Hero Section with Banner Visual */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-900 to-primary-800 text-white">
        <div className="container-narrow py-12 sm:py-16 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-7">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-500/40 bg-primary-700/60 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary-200">
                <span className="h-2 w-2 rounded-full bg-secondary-400"></span>
                APMC Market Yard • Pune, Maharashtra
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                {t('heroTitle')}
              </h1>
              <p className="mt-4 text-lg text-primary-100 sm:text-xl lg:text-2xl">
                {t('heroSubtitle')}
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center rounded-lg bg-white px-6 py-3.5 text-base font-semibold text-primary-800 shadow-md transition hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-900"
                >
                  {t('heroCta')}
                </Link>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${tCommon('whatsapp')} — ${tCommon('enquireNow')}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/40 bg-white/10 px-6 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-900"
                >
                  💬 {tCommon('whatsapp')}
                </a>
              </div>

              {/* Quick stats / trust points */}
              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-primary-700/60 pt-6">
                <div>
                  <p className="text-2xl font-bold text-white sm:text-3xl">100%</p>
                  <p className="text-xs text-primary-200 sm:text-sm">Direct Farm Produce</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white sm:text-3xl">50+ T</p>
                  <p className="text-xs text-primary-200 sm:text-sm">Monthly Wholesale Volume</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white sm:text-3xl">Daily</p>
                  <p className="text-xs text-primary-200 sm:text-sm">Fresh Mandi Arrivals</p>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Banner Image Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md overflow-hidden rounded-2xl border-2 border-white/20 shadow-2xl lg:max-w-none">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src="/images/banners/hero-produce.jpg"
                    alt="Fresh wholesale produce market"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                </div>
                <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-surface-900/85 p-3.5 backdrop-blur-md text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-secondary-400">Wholesale Mandi Rates</p>
                      <p className="text-sm font-bold">Bulk Bags • Crates • Truckloads</p>
                    </div>
                    <span className="rounded-full bg-primary-600 px-2.5 py-1 text-xs font-bold text-white">
                      Live
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Feature Strip */}
      <section className="border-b border-surface-200 bg-surface-100 py-6">
        <div className="container-narrow">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-3xl" aria-hidden="true">🚜</span>
              <div>
                <p className="text-sm font-bold text-surface-900">Direct From Farms</p>
                <p className="text-xs text-surface-600">Nashik, Pune & Maharashtra</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-3xl" aria-hidden="true">⚖️</span>
              <div>
                <p className="text-sm font-bold text-surface-900">Certified Weight</p>
                <p className="text-xs text-surface-600">Graded quality check</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-3xl" aria-hidden="true">🚚</span>
              <div>
                <p className="text-sm font-bold text-surface-900">Bulk Distribution</p>
                <p className="text-xs text-surface-600">Daily logistics dispatch</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-3xl" aria-hidden="true">💬</span>
              <div>
                <p className="text-sm font-bold text-surface-900">Quick Quotation</p>
                <p className="text-xs text-surface-600">Fast WhatsApp replies</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories with Visual Cards */}
      <section className="bg-white py-16 sm:py-20" aria-labelledby="categories-heading">
        <div className="container-narrow">
          <div className="text-center">
            <h2 id="categories-heading" className="text-3xl font-bold text-surface-900 sm:text-4xl">
              {t('categoriesTitle')}
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-surface-600">
              Browse our complete range of fresh wholesale commodities
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((cat) => {
              const imageSrc = cat.image || categoryImages[cat.id] || '/placeholder-product.svg';
              return (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-surface-200 bg-surface-50 shadow-sm transition hover:-translate-y-1 hover:border-primary-400 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-100">
                    <Image
                      src={imageSrc}
                      alt={cat.name[loc]}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 rounded-md bg-surface-900/80 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
                      {categoryIcons[cat.id] || '📦'}
                    </div>
                  </div>
                  <div className="p-3.5 text-center">
                    <span className="text-sm font-semibold text-surface-900 group-hover:text-primary-700">
                      {cat.name[loc]}
                    </span>
                    <p className="mt-0.5 text-xs text-primary-600 font-medium">View Bulk Lots →</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Wholesale Promotional Banner Strip */}
      <section className="relative overflow-hidden bg-surface-900 text-white">
        <div className="relative aspect-[21/9] sm:aspect-[24/7] min-h-[260px] w-full">
          <Image
            src="/images/banners/wholesale-logistics.jpg"
            alt="Wholesale warehouse and logistics banner"
            fill
            sizes="100vw"
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-950/95 via-surface-950/80 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="container-narrow">
              <div className="max-w-2xl py-6">
                <span className="rounded bg-secondary-500 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-surface-950">
                  Bulk Supply Partner
                </span>
                <h3 className="mt-3 text-2xl font-bold sm:text-3xl lg:text-4xl">
                  Supplying Restaurants, Supermarkets & Caterers Across Maharashtra
                </h3>
                <p className="mt-2 text-sm text-surface-300 sm:text-base">
                  Get daily custom wholesale quotes for onions, potatoes, tomatoes and seasonal produce with direct delivery from APMC Pune.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-green-700"
                  >
                    💬 Get Wholesale Quote
                  </a>
                  <a
                    href={phoneTel}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
                  >
                    📞 Call Sales Desk
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-surface-50 py-16 sm:py-20" aria-labelledby="featured-heading">
        <div className="container-narrow">
          <div className="flex items-center justify-between">
            <div>
              <h2 id="featured-heading" className="text-3xl font-bold text-surface-900 sm:text-4xl">
                {t('featuredTitle')}
              </h2>
              <p className="mt-1 text-sm text-surface-600">Top-demand wholesale items available for immediate order</p>
            </div>
            <Link
              href="/products"
              className="text-sm font-semibold text-primary-600 hover:text-primary-700"
            >
              {tCommon('viewAll')} →
            </Link>
          </div>
          {featuredProducts.length > 0 ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => {
                const category = categories.find((c) => c.id === product.categoryId);
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    categoryName={category?.name[loc] || ''}
                  />
                );
              })}
            </div>
          ) : (
            <p className="mt-10 text-center text-surface-500">{tCommon('noResults')}</p>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-16 sm:py-24" aria-labelledby="why-heading">
        <div className="container-narrow">
          <h2 id="why-heading" className="text-center text-3xl font-bold text-surface-900 sm:text-4xl">
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
                <div className="mb-4 text-4xl" aria-hidden="true">{item.icon}</div>
                <h3 className="text-lg font-semibold text-surface-900">{item.title}</h3>
                <p className="mt-2 text-sm text-surface-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Summary with Market Yard Banner */}
      <section className="bg-surface-50 py-16" aria-labelledby="contact-heading">
        <div className="container-narrow">
          <h2 id="contact-heading" className="sr-only">{tNav('contact')}</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <a
              href={phoneTel}
              aria-label={`${tCommon('call')} ${phone}`}
              className="flex items-center gap-4 rounded-xl border border-surface-200 bg-white p-6 transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-100 text-2xl" aria-hidden="true">📞</div>
              <div>
                <p className="text-sm text-surface-500">{tCommon('call')}</p>
                <p className="font-semibold text-surface-900">{phone}</p>
              </div>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${tCommon('whatsapp')} — ${tCommon('enquireNow')}`}
              className="flex items-center gap-4 rounded-xl border border-surface-200 bg-white p-6 transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100 text-2xl" aria-hidden="true">💬</div>
              <div>
                <p className="text-sm text-surface-500">{tCommon('whatsapp')}</p>
                <p className="font-semibold text-surface-900">{tCommon('enquireNow')}</p>
              </div>
            </a>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${tCommon('directions')} — Market Yard, Pune`}
              className="flex items-center gap-4 rounded-xl border border-surface-200 bg-white p-6 transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary-100 text-2xl" aria-hidden="true">📍</div>
              <div>
                <p className="text-sm text-surface-500">{tCommon('directions')}</p>
                <p className="font-semibold text-surface-900">Market Yard, Pune</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* WhatsApp Call To Action Banner */}
      <section className="bg-primary-700 py-16 text-white sm:py-20">
        <div className="container-narrow text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">{t('ctaTitle')}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-100">
            {t('ctaSubtitle')}
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-semibold text-primary-700 shadow-lg transition hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-700"
          >
            💬 {t('ctaButton')}
          </a>
        </div>
      </section>
    </div>
  );
}
