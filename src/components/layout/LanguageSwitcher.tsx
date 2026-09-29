'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';

const localeLabels: Record<Locale, string> = {
  en: 'EN',
  hi: 'हिं',
  mr: 'मरा',
};

const localeFullNames: Record<Locale, string> = {
  en: 'English',
  hi: 'हिन्दी',
  mr: 'मराठी',
};

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  function handleLocaleChange(newLocale: Locale) {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-surface-200 bg-surface-50 p-0.5">
      {(['en', 'hi', 'mr'] as const).map((loc) => (
        <button
          key={loc}
          onClick={() => handleLocaleChange(loc)}
          className={`rounded-md px-2 py-1 text-xs font-medium transition ${
            locale === loc
              ? 'bg-primary-600 text-white shadow-sm'
              : 'text-surface-600 hover:bg-surface-200 hover:text-surface-900'
          }`}
          aria-label={`Switch to ${localeFullNames[loc]}`}
          aria-current={locale === loc ? 'true' : undefined}
          title={localeFullNames[loc]}
        >
          {localeLabels[loc]}
        </button>
      ))}
    </div>
  );
}
