import { setRequestLocale, getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'nav' });
  return { title: t('terms') };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('nav');

  return (
    <div className="container-narrow py-12 sm:py-20">
      <h1 className="mb-8 text-3xl font-bold text-surface-900">{t('terms')}</h1>
      <div className="prose max-w-none space-y-4 text-surface-600">
        <p>This is a placeholder for the Terms & Conditions. Full content will be added before launch.</p>
        <p>By using this website, you agree to abide by the terms and conditions set forth by Mauli Wholesalers. All wholesale enquiries and transactions are subject to availability and final confirmation.</p>
      </div>
    </div>
  );
}
