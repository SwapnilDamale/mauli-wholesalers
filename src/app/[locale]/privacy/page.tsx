import { setRequestLocale, getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'nav' });
  return { title: t('privacy') };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('nav');

  return (
    <div className="container-narrow py-12 sm:py-20">
      <h1 className="mb-8 text-3xl font-bold text-surface-900">{t('privacy')}</h1>
      <div className="prose max-w-none space-y-4 text-surface-600">
        <p>This is a placeholder for the Privacy Policy. Full content will be added before launch.</p>
        <p>Your privacy is important to us. This page will outline how we collect, use, and protect your personal information when you use our website or submit enquiries.</p>
      </div>
    </div>
  );
}
