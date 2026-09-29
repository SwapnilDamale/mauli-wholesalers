'use server';

import { enquirySchema } from '@/lib/validations';
import { createEnquiry, getProductById } from '@/lib/firebase/services';

export interface EnquiryActionState {
  success: boolean;
  error: string | null;
}

function firstIssueMessage(error: { issues: { path: PropertyKey[]; message: string }[] }): {
  path: PropertyKey;
  message: string;
} {
  const issue = error.issues[0];
  return { path: issue?.path[0] ?? '', message: issue?.message ?? 'Invalid input' };
}

export async function submitEnquiry(
  _prevState: EnquiryActionState,
  formData: FormData
): Promise<EnquiryActionState> {
  const raw = {
    name: String(formData.get('name') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    email: String(formData.get('email') ?? ''),
    productId: String(formData.get('productId') ?? ''),
    productNameSnapshot: '',
    quantity: String(formData.get('quantity') ?? ''),
    message: String(formData.get('message') ?? ''),
    language: String(formData.get('language') ?? 'en'),
    website: String(formData.get('website') ?? ''),
  };

  const result = enquirySchema.safeParse(raw);
  if (!result.success) {
    const firstError = firstIssueMessage(result.error);
    if (firstError.path === 'website') {
      return { success: true, error: null };
    }
    return { success: false, error: firstError.message };
  }

  let productNameSnapshot = result.data.productNameSnapshot;
  if (result.data.productId) {
    const product = await getProductById(result.data.productId);
    if (product) {
      productNameSnapshot = product.name[result.data.language];
    }
  }

  try {
    const { website: _honeypot, ...enquiryData } = result.data;
    await createEnquiry({
      ...enquiryData,
      productNameSnapshot,
    });
    return { success: true, error: null };
  } catch (error) {
    console.error('Failed to submit enquiry:', error);
    return { success: false, error: 'Failed to submit enquiry' };
  }
}
