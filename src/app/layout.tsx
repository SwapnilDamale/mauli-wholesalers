import type { Metadata } from 'next';
import { Inter, Noto_Sans_Devanagari } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-noto',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Mauli Wholesalers',
  description: 'Fresh produce wholesale supplier in Maharashtra',
};

/**
 * Root layout — wraps ALL routes including /admin and /[locale].
 * Provides the required <html> and <body> tags for Next.js App Router.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${notoDevanagari.variable}`}>
      <body className="flex min-h-screen flex-col bg-surface-50 text-surface-900 antialiased">
        {children}
      </body>
    </html>
  );
}
