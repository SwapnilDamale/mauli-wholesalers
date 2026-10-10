'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { Product, Category } from '@/types';
import type { Locale } from '@/i18n/routing';
import { categoryIcons, categoryImages } from '@/lib/mock-data';
import ProductCard from '@/components/ui/ProductCard';
import SearchInput from '@/components/ui/SearchInput';

interface ProductsPageClientProps {
  products: Product[];
  categories: Category[];
  locale: string;
}

type AvailabilityFilter = 'all' | 'available' | 'unavailable';

export default function ProductsPageClient({
  products,
  categories,
  locale,
}: ProductsPageClientProps) {
  const t = useTranslations('products');
  const tCommon = useTranslations('common');
  const loc = locale as Locale;
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [availability, setAvailability] = useState<AvailabilityFilter>('all');

  // Sync category from URL search params if present
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  const activeCategoryObj = categories.find((c) => c.slug === selectedCategory || c.id === selectedCategory);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      product.categoryId === selectedCategory ||
      (activeCategoryObj && product.categoryId === activeCategoryObj.id);
    const productName = product.name[loc].toLowerCase();
    const matchesSearch = productName.includes(searchQuery.toLowerCase());
    const matchesAvailability =
      availability === 'all' ||
      (availability === 'available' && product.available) ||
      (availability === 'unavailable' && !product.available);
    return matchesCategory && matchesSearch && matchesAvailability;
  });

  // Banner details
  const bannerImage = activeCategoryObj
    ? activeCategoryObj.image || categoryImages[activeCategoryObj.id] || '/images/banners/wholesale-logistics.jpg'
    : '/images/banners/wholesale-logistics.jpg';

  const bannerTitle = activeCategoryObj
    ? `${categoryIcons[activeCategoryObj.id] || '📦'} ${activeCategoryObj.name[loc]}`
    : t('pageTitle');

  const bannerSubtitle = activeCategoryObj
    ? `Fresh wholesale lots available for direct dispatch • ${filteredProducts.length} items listed`
    : `${t('pageDescription')} • Daily Mandi Rates & Bulk Logistics`;

  return (
    <div className="space-y-8">
      {/* Category / Catalogue Visual Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-surface-900 text-white shadow-md">
        <div className="relative aspect-[21/7] min-h-[160px] sm:min-h-[190px] w-full">
          <Image
            src={bannerImage}
            alt={bannerTitle}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1200px"
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-950/90 via-surface-950/70 to-transparent" />
          <div className="absolute inset-0 flex items-center p-6 sm:p-10">
            <div className="max-w-xl">
              <span className="inline-block rounded bg-primary-600 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
                Wholesale Catalogue
              </span>
              <h1 className="mt-2 text-2xl font-bold sm:text-3xl lg:text-4xl text-white">
                {bannerTitle}
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-surface-200">
                {bannerSubtitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2" role="group" aria-label={t('filterByCategory')}>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              selectedCategory === 'all'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
            }`}
          >
            {tCommon('allCategories')}
          </button>
          {categories.map((category) => {
            const isSelected = selectedCategory === category.id || selectedCategory === category.slug;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  isSelected
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
                }`}
              >
                <span>{categoryIcons[category.id] || '📦'}</span>
                <span>{category.name[loc]}</span>
              </button>
            );
          })}
        </div>

        {/* Search + Availability Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-surface-200 pt-4">
          <div className="flex gap-2" role="group" aria-label={t('availability')}>
            {(['all', 'available', 'unavailable'] as AvailabilityFilter[]).map((value) => {
              const label =
                value === 'all'
                  ? tCommon('viewAll')
                  : value === 'available'
                  ? tCommon('available')
                  : tCommon('outOfStock');
              return (
                <button
                  key={value}
                  onClick={() => setAvailability(value)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    availability === value
                      ? 'bg-surface-800 text-white shadow-sm'
                      : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <div className="w-full sm:w-72">
            <SearchInput value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => {
            const category = categories.find((c) => c.id === product.categoryId);
            return (
              <ProductCard
                key={product.id}
                product={product}
                categoryName={category?.name[loc] || ''}
              />
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-surface-300 py-16 text-center">
          <p className="text-4xl mb-4" aria-hidden="true">🔍</p>
          <p className="text-lg font-medium text-surface-700">{tCommon('noResults')}</p>
          <p className="mt-2 text-sm text-surface-500">
            {searchQuery
              ? `No items found matching "${searchQuery}"`
              : 'No items currently available in this filter'}
          </p>
          {(searchQuery || selectedCategory !== 'all' || availability !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setAvailability('all');
              }}
              className="mt-4 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {tCommon('viewAll')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
