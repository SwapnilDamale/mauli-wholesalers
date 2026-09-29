'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { mockProducts } from '@/lib/mock-data';
import type { Locale } from '@/i18n/routing';
import Button from '@/components/ui/Button';
import { submitEnquiry } from '@/actions/enquiry';

export default function EnquiryForm({ locale }: { locale: string }) {
  const t = useTranslations('contact');
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', productId: '', quantity: '', message: '', website: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = 'Required';
    if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 10) e.phone = 'Min 10 digits';
    if (!formData.message.trim()) e.message = 'Required';
    return e;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setServerError(null);

    const form = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await submitEnquiry({ success: false, error: null }, form);
      if (res.success) {
        setIsSubmitted(true);
        setFormData({ name: '', phone: '', email: '', productId: '', quantity: '', message: '', website: '' });
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        setServerError(res.error || t('formError'));
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const inputClass = 'mt-1 block w-full rounded-lg border border-surface-300 px-3 py-2.5 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input type="hidden" name="language" value={locale} />
      {/* Honeypot field for bot protection */}
      <div className="hidden" aria-hidden="true">
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={formData.website}
          onChange={handleChange}
        />
      </div>

      {isSubmitted && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          {t('formSuccess')}
        </div>
      )}

      {serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {serverError}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-surface-700">{t('formName')} *</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={inputClass} />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-surface-700">{t('formPhone')} *</label>
        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} />
        {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-surface-700">{t('formEmail')}</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} />
      </div>

      <div>
        <label htmlFor="productId" className="block text-sm font-medium text-surface-700">{t('formProduct')}</label>
        <select id="productId" name="productId" value={formData.productId} onChange={handleChange} className={inputClass}>
          <option value="">{t('formProductPlaceholder')}</option>
          {mockProducts.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name[locale as Locale]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-surface-700">{t('formQuantity')}</label>
        <input type="text" id="quantity" name="quantity" value={formData.quantity} onChange={handleChange} className={inputClass} />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-surface-700">{t('formMessage')} *</label>
        <textarea id="message" name="message" rows={4} value={formData.message} onChange={handleChange} className={inputClass} />
        {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
      </div>

      <Button type="submit" fullWidth size="lg" loading={isPending}>
        {t('formSubmit')}
      </Button>
    </form>
  );
}
