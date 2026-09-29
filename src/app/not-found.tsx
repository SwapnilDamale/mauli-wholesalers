/**
 * Global not-found page — catches routes that don't match any locale.
 * Renders a minimal 404 outside the locale layout.
 */
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-8xl font-bold text-gray-200">404</div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Page Not Found</h1>
          <p className="mt-2 text-gray-600">
            The page you&apos;re looking for doesn&apos;t exist.
          </p>
          <a
            href="/en"
            className="mt-6 inline-block rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700"
          >
            Go to Homepage
          </a>
        </div>
      </body>
    </html>
  );
}
