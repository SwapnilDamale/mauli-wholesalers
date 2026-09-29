import { useTranslations } from 'next-intl';

export default function NotFoundPage() {
  const t = useTranslations('notFound');
  const tCommon = useTranslations('common');

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl font-bold text-primary-200">404</div>
      <h1 className="mt-4 text-2xl font-bold text-surface-900 sm:text-3xl">
        {t('title')}
      </h1>
      <p className="mt-2 text-surface-600">{t('description')}</p>
      <a
        href="/"
        className="mt-8 inline-flex items-center rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
      >
        {tCommon('goHome')}
      </a>
    </div>
  );
}
