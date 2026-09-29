import { setRequestLocale, getTranslations } from 'next-intl/server';
import { mockSettings } from '@/lib/mock-data';
import EnquiryForm from './EnquiryForm';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  };
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

  return (
    <div className="container-narrow py-12 sm:py-20">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-surface-900 sm:text-4xl">{t('pageTitle')}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-surface-600">{t('pageDescription')}</p>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        <div className="space-y-8">
          <div className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold text-surface-900">{t('getInTouch')}</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="text-2xl">📞</span>
                <div>
                  <p className="font-medium text-surface-900">{t('phone')}</p>
                  <a href={`tel:${mockSettings.phone.replace(/[^+\d]/g, '')}`} className="text-primary-600 hover:underline">{mockSettings.phone}</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-2xl">💬</span>
                <div>
                  <p className="font-medium text-surface-900">{tCommon('whatsapp')}</p>
                  <a href={`https://wa.me/${mockSettings.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                    +{mockSettings.whatsapp}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-2xl">✉️</span>
                <div>
                  <p className="font-medium text-surface-900">{t('email')}</p>
                  <a href={`mailto:${mockSettings.email}`} className="text-primary-600 hover:underline">{mockSettings.email}</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="font-medium text-surface-900">{t('address')}</p>
                  <p className="text-surface-600">{mockSettings.address}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold text-surface-900">{t('businessHours')}</h2>
            <ul className="space-y-2 text-surface-600">
              {Object.entries(mockSettings.hours).map(([day, hours]) => (
                <li key={day} className="flex justify-between">
                  <span className="capitalize">{dayLabels[day] || day}</span>
                  <span className={`font-medium ${hours === 'Closed' ? 'text-red-600' : ''}`}>{hours}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-surface-900">{t('enquiryForm')}</h2>
          <EnquiryForm locale={locale} />
        </div>
      </div>

      {/* Map placeholder */}
      <div className="mt-12 overflow-hidden rounded-xl border border-surface-200">
        <div className="flex h-96 items-center justify-center bg-surface-100">
          <div className="text-center text-surface-500">
            <span className="mb-2 block text-4xl">🗺️</span>
            <p>{t('findUs')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
