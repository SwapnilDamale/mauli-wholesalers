'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import type { Product } from '@/types';
import type { Locale } from '@/i18n/routing';
import Card from './Card';
import Badge from './Badge';
import { unitLabels } from '@/lib/catalog';

interface ProductCardProps {
  product: Product;
  categoryName: string;
}

export default function ProductCard({ product, categoryName }: ProductCardProps) {
  const t = useTranslations('common');
  const locale = useLocale() as Locale;

  return (
    <Link href={`/products/${product.slug}`}>
      <Card hoverable noPadding className="group h-full">
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-100">
          <Image
            src={product.images[0] || '/placeholder-product.svg'}
            alt={product.name[locale]}
            width={400}
            height={300}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            {product.featured && <Badge variant="featured">{t('featured')}</Badge>}
            {product.seasonal && <Badge variant="seasonal">{t('seasonal')}</Badge>}
          </div>
        </div>
        <div className="p-4">
          <p className="text-xs font-medium text-primary-600">{categoryName}</p>
          <h3 className="mt-1 text-lg font-semibold text-surface-900">
            {product.name[locale]}
          </h3>
          <div className="mt-2 flex items-center justify-between">
            {product.priceVisible && product.price != null ? (
              <p className="text-lg font-bold text-primary-700">
                ₹{product.price}{' '}
                <span className="text-sm font-normal text-surface-500">
                  /{unitLabels[product.unit]?.[locale] || product.unit}
                </span>
              </p>
            ) : (
              <p className="text-sm font-medium text-secondary-600">{t('enquireForPrice')}</p>
            )}
            <Badge variant={product.available ? 'available' : 'outOfStock'}>
              {product.available ? t('available') : t('outOfStock')}
            </Badge>
          </div>
        </div>
      </Card>
    </Link>
  );
}
