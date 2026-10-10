'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [_user, setUser] = useState<User | null>(null);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);
      if (!currentUser && !isLoginPage) {
        router.push('/admin/login');
      }
    });

    return () => unsubscribe();
  }, [isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-surface-100 flex items-center justify-center p-4">
        {children}
      </div>
    );
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-surface-100 flex flex-col items-center justify-center p-4 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-primary-600 border-t-transparent mb-3"></div>
        <p className="text-sm font-medium text-surface-600">Verifying administrator credentials...</p>
      </div>
    );
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/products', label: 'Products' },
    { href: '/admin/categories', label: 'Categories' },
    { href: '/admin/enquiries', label: 'Enquiries' },
    { href: '/admin/settings', label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-surface-50 text-surface-900 flex flex-col">
      {/* Admin Top Header */}
      <header className="bg-surface-900 text-white sticky top-0 z-50 border-b border-surface-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/admin" className="font-bold text-lg text-primary-400">
              माऊली Admin
            </Link>
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    pathname === item.href
                      ? 'bg-primary-600 text-white'
                      : 'text-surface-300 hover:bg-surface-800 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/en"
              target="_blank"
              className="text-xs bg-surface-800 hover:bg-surface-700 px-3 py-1.5 rounded-md text-surface-200 transition"
            >
              View Public Site ↗
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs bg-red-600/80 hover:bg-red-600 text-white px-3 py-1.5 rounded-md font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Nav sub-bar */}
        <div className="md:hidden flex overflow-x-auto border-t border-surface-800 px-2 py-2 gap-1 bg-surface-900">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition ${
                pathname === item.href
                  ? 'bg-primary-600 text-white'
                  : 'text-surface-300 hover:bg-surface-800'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
