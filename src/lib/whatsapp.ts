/**
 * WhatsApp click-to-chat utilities.
 *
 * Generates wa.me links with locale-specific pre-filled messages.
 */

import type { Locale } from '@/i18n/routing';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '91XXXXXXXXXX';
const BUSINESS_NAME = 'Mauli Wholesalers';

/** Locale-specific product enquiry message templates */
const productMessageTemplates: Record<Locale, (productName: string) => string> = {
  en: (product) =>
    `Hello ${BUSINESS_NAME}, I am interested in ${product}. Please share the current wholesale price and availability.`,
  hi: (product) =>
    `नमस्ते माऊली होलसेलर्स, मुझे ${product} चाहिए। कृपया वर्तमान थोक कीमत और उपलब्धता बताएं।`,
  mr: (product) =>
    `नमस्कार माऊली होलसेलर्स, मला ${product} हवा आहे. कृपया सध्याची घाऊक किंमत आणि उपलब्धता सांगा.`,
};

/** Locale-specific general enquiry message templates */
const generalMessageTemplates: Record<Locale, string> = {
  en: `Hello ${BUSINESS_NAME}, I am interested in your wholesale products. Please share more details.`,
  hi: `नमस्ते माऊली होलसेलर्स, मुझे आपके थोक उत्पादों में रुचि है। कृपया अधिक जानकारी दें।`,
  mr: `नमस्कार माऊली होलसेलर्स, मला तुमच्या घाऊक उत्पादनांमध्ये रस आहे. कृपया अधिक माहिती द्या.`,
};

/** Build a wa.me URL for a product enquiry */
export function getProductWhatsAppUrl(productName: string, locale: Locale): string {
  const message = productMessageTemplates[locale](productName);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Build a wa.me URL for a general enquiry */
export function getGeneralWhatsAppUrl(locale: Locale): string {
  const message = generalMessageTemplates[locale];
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Build a wa.me URL with no pre-filled message */
export function getWhatsAppBaseUrl(): string {
  return `https://wa.me/${WHATSAPP_NUMBER}`;
}

/** Get the raw phone number for tel: links */
export function getPhoneNumber(): string {
  return process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+91-XXXXXXXXXX';
}

/** Get the phone number cleaned for tel: href */
export function getPhoneTelUrl(): string {
  return `tel:${getPhoneNumber().replace(/[^+\d]/g, '')}`;
}

/** Get Google Maps directions URL */
export function getMapsUrl(): string {
  return process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL || 'https://maps.google.com/?q=Market+Yard+Pune';
}
