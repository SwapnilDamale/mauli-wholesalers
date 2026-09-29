import { setRequestLocale, getTranslations } from 'next-intl/server';
import { mockSettings } from '@/lib/mock-data';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  };
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

  return (
    <div>
      <div className="bg-primary-700 py-16 text-white sm:py-24">
        <div className="container-narrow text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{t('pageTitle')}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-100">
            {t('pageDescription')}
          </p>
        </div>
      </div>

      <div className="container-narrow py-16 sm:py-24">
        <div className="mx-auto mb-16 max-w-3xl">
          <h2 className="mb-4 text-2xl font-bold text-surface-900">{t('ourStory')}</h2>
          <p className="text-lg leading-relaxed text-surface-600">
            {mockSettings.aboutText[locale as Locale]}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl bg-surface-50 p-8 md:p-12">
            <div className="mb-4 text-4xl">🏪</div>
            <h2 className="mb-4 text-2xl font-bold text-surface-900">{t('wholesaleFocus')}</h2>
            <p className="text-surface-600">{t('wholesaleFocusDesc')}</p>
          </div>
          <div className="rounded-2xl bg-surface-50 p-8 md:p-12">
            <div className="mb-4 text-4xl">📍</div>
            <h2 className="mb-4 text-2xl font-bold text-surface-900">{t('serviceArea')}</h2>
            <p className="text-surface-600">{t('serviceAreaDesc')}</p>
          </div>
        </div>
      </div>

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
                <div className="mb-4 text-4xl">{item.icon}</div>
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
