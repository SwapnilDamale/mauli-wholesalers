import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { isFirebaseAdminConfigured } from '@/lib/firebase/env';

/**
 * Server-side auth guard for admin pages.
 * Reads the __session cookie (Firebase App Hosting standard) and verifies
 * it carries an admin custom claim. Redirects to /admin/login on failure.
 *
 * In local dev without Firebase Admin credentials the guard falls through
 * so development is not blocked (only 1-2 developers, protected by credentials in production).
 */
export async function requireAdmin(): Promise<void> {
  // Skip auth check in local dev when Admin SDK is not configured
  if (!isFirebaseAdminConfigured()) {
    return;
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('__session')?.value;

  if (!sessionCookie) {
    redirect('/admin/login');
  }

  try {
    const { getAdminAuth } = await import('@/lib/firebase/admin');
    const adminAuth = await getAdminAuth();
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    const isAdmin = decoded.admin === true;
    if (!isAdmin) {
      redirect('/admin/login');
    }
  } catch {
    redirect('/admin/login');
  }
}

