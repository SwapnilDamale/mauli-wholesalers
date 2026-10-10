import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileCTABar from '@/components/layout/MobileCTABar';
import GA4 from '@/components/analytics/GA4';

import { getBusinessSettings } from '@/lib/services/product-service';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Load messages and live settings
  const [messages, settings] = await Promise.all([
    getMessages(),
    getBusinessSettings(),
  ]);

  return (
    <div className="flex min-h-screen flex-col pb-16 lg:pb-0">
      <GA4 />
      <NextIntlClientProvider messages={messages}>
        <Header />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer settings={settings} />
        <MobileCTABar settings={settings} />
      </NextIntlClientProvider>
    </div>
  );
}
