import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mauli Wholesalers',
  description: 'Fresh produce wholesale supplier in Maharashtra',
};

/**
 * Root layout — this layout wraps ALL routes including /admin.
 * The [locale] layout handles i18n for public routes.
 * This root layout only provides the base HTML structure.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
