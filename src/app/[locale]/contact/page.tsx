import { setRequestLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { getBusinessSettings } from '@/lib/services/product-service';
import { getGeneralWhatsAppUrl, getPhoneTelUrl, getMapsUrl } from '@/lib/whatsapp';
import { buildPageMetadata } from '@/lib/seo';
import type { Locale } from '@/i18n/routing';
import EnquiryForm from './EnquiryForm';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  return buildPageMetadata({
    locale,
    path: '/contact',
    title: t('pageTitle'),
    description: t('pageDescription'),
  });
}

const dayLabels: Record<string, string> = {
  mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday',
  fri: 'Friday', sat: 'Saturday', sun: 'Sunday',
};

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact');
  const tCommon = await getTranslations('common');
  const loc = locale as Locale;

  const settings = await getBusinessSettings();
  const whatsappUrl = getGeneralWhatsAppUrl(loc, settings.whatsapp);
  const phoneTel = getPhoneTelUrl(settings.phone);
  const mapsUrl = getMapsUrl(settings.mapsUrl);

  return (
    <div>
      {/* Contact Hero Banner */}
      <div className="relative overflow-hidden bg-primary-900 py-16 text-white sm:py-20">
        <Image
          src="/images/banners/market-yard.jpg"
          alt="APMC Market Yard Pune"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-900/80 to-primary-900/60" />
        <div className="container-narrow relative text-center">
          <span className="mb-3 inline-block rounded-full bg-primary-700/80 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-primary-200">
            Wholesale Trading Counter
          </span>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{t('pageTitle')}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-100">
            {t('pageDescription')}
          </p>
        </div>
      </div>

      <div className="container-narrow py-12 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            {/* Contact Info Card */}
            <div className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-6 text-xl font-semibold text-surface-900">{t('getInTouch')}</h2>
              <div className="space-y-5">
                <a href={phoneTel} className="flex items-start gap-4 group" aria-label={`${t('phone')}: ${settings.phone}`}>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-xl" aria-hidden="true">📞</span>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-surface-500 font-semibold">{t('phone')}</p>
                    <p className="text-base font-bold text-surface-900 group-hover:text-primary-600">{settings.phone}</p>
                    <p className="text-xs text-surface-500">Call for daily mandi rates & availability</p>
                  </div>
                </a>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group" aria-label={`${tCommon('whatsapp')}: +${settings.whatsapp}`}>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-100 text-xl" aria-hidden="true">💬</span>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-surface-500 font-semibold">{tCommon('whatsapp')}</p>
                    <p className="text-base font-bold text-surface-900 group-hover:text-primary-600">+{settings.whatsapp}</p>
                    <p className="text-xs text-surface-500">Fastest response for wholesale quotes & lot bookings</p>
                  </div>
                </a>
                <a href={`mailto:${settings.email}`} className="flex items-start gap-4 group" aria-label={`${t('email')}: ${settings.email}`}>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-surface-100 text-xl" aria-hidden="true">✉️</span>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-surface-500 font-semibold">{t('email')}</p>
                    <p className="text-base font-bold text-surface-900 group-hover:text-primary-600">{settings.email}</p>
                    <p className="text-xs text-surface-500">Institutional purchase orders & procurement</p>
                  </div>
                </a>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group" aria-label={`${t('address')}: ${settings.address}`}>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-secondary-100 text-xl" aria-hidden="true">📍</span>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-surface-500 font-semibold">{t('address')}</p>
                    <p className="text-base font-bold text-surface-900 group-hover:text-primary-600">{settings.address}</p>
                    <p className="text-xs text-primary-600 font-medium">Open Google Maps Directions →</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Business Hours */}
            <div className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-6 text-xl font-semibold text-surface-900">{t('businessHours')}</h2>
              <ul className="space-y-2.5 text-surface-600">
                {Object.entries(settings.hours).map(([day, hours]) => (
                  <li key={day} className="flex justify-between border-b border-surface-100 pb-2 text-sm last:border-none last:pb-0">
                    <span className="capitalize font-medium text-surface-700">{dayLabels[day] || day}</span>
                    <span className={`font-semibold ${hours === 'Closed' ? 'text-red-600' : 'text-surface-900'}`}>{hours}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-surface-500">
                * Note: Wholesale APMC auction and arrival hours begin early morning at 5:00 AM.
              </p>
            </div>
          </div>

          {/* Enquiry Form */}
          <div className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-2 text-xl font-semibold text-surface-900">{t('enquiryForm')}</h2>
            <p className="mb-6 text-sm text-surface-600">
              Fill in your requirements for bulk rates. We respond within a few business hours.
            </p>
            <EnquiryForm locale={locale} />
          </div>
        </div>

        {/* Location Banner with Directions Link */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-surface-200 bg-surface-900 text-white shadow-lg">
          <div className="grid md:grid-cols-12 items-center">
            <div className="p-8 md:col-span-7">
              <span className="rounded bg-secondary-500 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-surface-950">
                Visit Wholesale Depo
              </span>
              <h3 className="mt-3 text-2xl font-bold sm:text-3xl">APMC Market Yard, Pune</h3>
              <p className="mt-2 text-sm text-surface-300">
                {settings.address}
              </p>
              <p className="mt-2 text-xs text-surface-400">
                Direct access for commercial transport, trucks, tempos, and pickup vehicles.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-primary-700"
                >
                  📍 {tCommon('directions')} (Google Maps)
                </a>
                <a
                  href={phoneTel}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  📞 {tCommon('call')} Reception
                </a>
              </div>
            </div>
            <div className="relative aspect-[16/10] md:aspect-auto md:h-full md:col-span-5 min-h-[220px]">
              <Image
                src="/images/banners/market-yard.jpg"
                alt="Market Yard Pune wholesale location"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
