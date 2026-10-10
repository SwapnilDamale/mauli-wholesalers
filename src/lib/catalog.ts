import type { Locale } from '@/i18n/routing';

/** Category emoji icons for display */
export const categoryIcons: Record<string, string> = {
  vegetables: '🥬',
  fruits: '🍎',
  grains: '🌾',
  spices: '🌶️',
  grocery: '🛒',
};

/** Category dummy images */
export const categoryImages: Record<string, string> = {
  vegetables: '/images/categories/vegetables.jpg',
  fruits: '/images/categories/fruits.jpg',
  grains: '/images/categories/grains.jpg',
  spices: '/images/categories/spices.jpg',
  grocery: '/images/categories/grocery.jpg',
};

/** Unit display labels */
export const unitLabels: Record<string, Record<Locale, string>> = {
  kg: { en: 'kg', hi: 'किलो', mr: 'किलो' },
  quintal: { en: 'quintal', hi: 'क्विंटल', mr: 'क्विंटल' },
  dozen: { en: 'dozen', hi: 'दर्जन', mr: 'डझन' },
  box: { en: 'box', hi: 'बॉक्स', mr: 'बॉक्स' },
};
