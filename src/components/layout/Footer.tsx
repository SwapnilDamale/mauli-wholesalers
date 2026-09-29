'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');

  return (
    <footer className="border-t border-surface-200 bg-surface-900 text-surface-300">
      <div className="container-narrow py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-sm font-bold text-white">
                M
              </div>
              <span className="text-lg font-bold text-white">
                {tCommon('brandName')}
              </span>
            </div>
            <p className="mt-3 text-sm text-surface-400">
              {tCommon('tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t('quickLinks')}
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/" className="text-sm transition hover:text-primary-400">
                  {tNav('home')}
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm transition hover:text-primary-400">
                  {tNav('products')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm transition hover:text-primary-400">
                  {tNav('about')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm transition hover:text-primary-400">
                  {tNav('contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t('contactInfo')}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href="tel:+91XXXXXXXXXX" className="transition hover:text-primary-400">
                  📞 +91-XXXXXXXXXX
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '91XXXXXXXXXX'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-primary-400"
                >
                  💬 WhatsApp
                </a>
              </li>
              <li>
                <a href="mailto:info@mauliwholesalers.com" className="transition hover:text-primary-400">
                  ✉️ info@mauliwholesalers.com
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Legal
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/privacy" className="text-sm transition hover:text-primary-400">
                  {tNav('privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm transition hover:text-primary-400">
                  {tNav('terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-surface-700 pt-8 text-center text-sm text-surface-500">
          <p>
            © {new Date().getFullYear()} {tCommon('brandName')}.{' '}
            {t('allRightsReserved')}
          </p>
          <p className="mt-1">{t('madeWith')}</p>
        </div>
      </div>
    </footer>
  );
}
