import { setRequestLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { getBusinessSettings } from '@/lib/services/product-service';
import type { Locale } from '@/i18n/routing';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return buildPageMetadata({
    locale,
    path: '/about',
    title: t('pageTitle'),
    description: t('pageDescription'),
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');
  const tHome = await getTranslations('home');
  const settings = await getBusinessSettings();

  return (
    <div>
      {/* Hero Banner with Farm/Fresh Sourcing Background */}
      <div className="relative overflow-hidden bg-primary-900 py-20 text-white sm:py-28">
        <Image
          src="/images/banners/farm-fresh.jpg"
          alt="Fresh agricultural harvest"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-900/80 to-primary-900/60" />
        <div className="container-narrow relative text-center">
          <span className="mb-3 inline-block rounded-full bg-primary-700/80 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-primary-200">
            About Mauli Wholesalers
          </span>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">{t('pageTitle')}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-100 sm:text-xl">
            {t('pageDescription')}
          </p>
        </div>
      </div>

      <div className="container-narrow py-16 sm:py-24">
        {/* Story Section with Market Yard Visual */}
        <div className="grid items-center gap-12 lg:grid-cols-12 mb-16">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600">Our Heritage & Mission</span>
            <h2 className="text-3xl font-bold text-surface-900 sm:text-4xl">{t('ourStory')}</h2>
            <p className="text-lg leading-relaxed text-surface-600">
              {settings.aboutText[locale as Locale]}
            </p>
            <div className="pt-4 grid grid-cols-2 gap-4 border-t border-surface-200">
              <div>
                <p className="text-2xl font-bold text-primary-700">Market Yard, Pune</p>
                <p className="text-xs text-surface-500">Centrally located APMC hub</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary-700">Daily Procurement</p>
                <p className="text-xs text-surface-500">Direct from vetted farmer clusters</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-surface-200 shadow-xl">
              <Image
                src="/images/banners/market-yard.jpg"
                alt="Mauli Wholesalers Market Yard operations"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                <p className="text-xs font-medium text-secondary-400">APMC Wholesale Mandi</p>
                <p className="text-sm font-bold">Pune Hub • Direct Farmer Sourcing</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-surface-200 bg-surface-50 p-8 shadow-sm md:p-10">
            <div className="mb-4 text-4xl">🏪</div>
            <h3 className="mb-3 text-2xl font-bold text-surface-900">{t('wholesaleFocus')}</h3>
            <p className="text-surface-600 leading-relaxed">{t('wholesaleFocusDesc')}</p>
          </div>
          <div className="rounded-2xl border border-surface-200 bg-surface-50 p-8 shadow-sm md:p-10">
            <div className="mb-4 text-4xl">📍</div>
            <h3 className="mb-3 text-2xl font-bold text-surface-900">{t('serviceArea')}</h3>
            <p className="text-surface-600 leading-relaxed">{t('serviceAreaDesc')}</p>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <section className="border-t border-surface-200 bg-white py-16 sm:py-24">
        <div className="container-narrow">
          <h2 className="text-center text-3xl font-bold text-surface-900 sm:text-4xl">
            {tHome('whyChooseTitle')}
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: tHome('whyQuality'), desc: tHome('whyQualityDesc'), icon: '🌿' },
              { title: tHome('whyPricing'), desc: tHome('whyPricingDesc'), icon: '💰' },
              { title: tHome('whyDelivery'), desc: tHome('whyDeliveryDesc'), icon: '🚛' },
              { title: tHome('whyExperience'), desc: tHome('whyExperienceDesc'), icon: '⭐' },
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
    </div>
  );
}
