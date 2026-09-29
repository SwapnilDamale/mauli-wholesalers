import { mockSettings } from '@/lib/mock-data';

export default function LocalBusinessJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WholesaleStore',
    name: mockSettings.businessName,
    telephone: mockSettings.phone,
    email: mockSettings.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: mockSettings.address,
      addressLocality: 'Pune',
      addressRegion: 'Maharashtra',
      postalCode: '411037',
      addressCountry: 'IN',
    },
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://mauliwholesalers.com',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '06:00',
        closes: '20:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '06:00',
        closes: '18:00',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
