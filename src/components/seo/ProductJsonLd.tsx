import type { Product } from '@/types';
import type { Locale } from '@/i18n/routing';

interface ProductJsonLdProps {
  product: Product;
  locale: Locale;
}

export default function ProductJsonLd({ product, locale }: ProductJsonLdProps) {
  const productName = product.name[locale];
  const productDesc = product.description[locale];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mauliwholesalers.com';

  const jsonLd: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    description: productDesc,
    image: product.images.map((img) => (img.startsWith('http') ? img : `${siteUrl}${img}`)),
    sku: product.slug,
  };

  if (product.priceVisible && product.price != null) {
    jsonLd.offers = {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: product.price,
      availability: product.available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${siteUrl}/${locale}/products/${product.slug}`,
    };
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'Products', item: `${siteUrl}/${locale}/products` },
      { '@type': 'ListItem', position: 3, name: productName, item: `${siteUrl}/${locale}/products/${product.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}
