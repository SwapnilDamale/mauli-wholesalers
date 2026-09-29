'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Product, Category } from '@/types';
import type { Locale } from '@/i18n/routing';
import ProductCard from '@/components/ui/ProductCard';
import SearchInput from '@/components/ui/SearchInput';

interface ProductsPageClientProps {
  products: Product[];
  categories: Category[];
  locale: string;
}

export default function ProductsPageClient({
  products,
  categories,
  locale,
}: ProductsPageClientProps) {
  const t = useTranslations('products');
  const tCommon = useTranslations('common');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;
    const productName = product.name[locale as Locale].toLowerCase();
    const matchesSearch = productName.includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-surface-900 sm:text-4xl">{t('pageTitle')}</h1>
        <p className="mt-2 text-surface-600">{t('pageDescription')}</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              selectedCategory === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
            }`}
          >
            {tCommon('allCategories')}
          </button>
          {categories.filter(c => c.enabled).sort((a, b) => a.order - b.order).map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
              }`}
            >
              {category.name[locale as Locale]}
            </button>
          ))}
        </div>
        <div className="w-full sm:w-72">
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => {
            const category = categories.find((c) => c.id === product.categoryId);
            return (
              <ProductCard
                key={product.id}
                product={product}
                categoryName={category?.name[locale as Locale] || ''}
              />
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-surface-300 py-12 text-center text-surface-500">
          {tCommon('noResults')}
        </div>
      )}
    </div>
  );
}
