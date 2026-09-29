import Link from 'next/link';
import { getAllProducts, getAllCategories, getEnquiries } from '@/lib/firebase/services';
import { requireAdmin } from '@/lib/admin-auth';

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [products, categories, enquiries] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
    getEnquiries(),
  ]);


  const availableCount = products.filter((p) => p.available).length;
  const outOfStockCount = products.length - availableCount;
  const newEnquiriesCount = enquiries.filter((e) => e.status === 'new').length;

  const stats = [
    { label: 'Total Products', value: products.length, href: '/admin/products', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { label: 'Available / Out of Stock', value: `${availableCount} / ${outOfStockCount}`, href: '/admin/products', color: 'bg-green-50 text-green-700 border-green-200' },
    { label: 'Active Categories', value: categories.length, href: '/admin/categories', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { label: 'New Enquiries', value: newEnquiriesCount, href: '/admin/enquiries', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Dashboard Overview</h1>
        <p className="text-sm text-surface-500">Welcome to the Mauli Wholesalers management console.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`p-5 rounded-xl border ${stat.color} transition hover:shadow-md block`}
          >
            <p className="text-xs font-semibold uppercase tracking-wider opacity-80">{stat.label}</p>
            <p className="text-3xl font-extrabold mt-2">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Recent Enquiries Preview */}
      <div className="bg-white rounded-xl border border-surface-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-surface-900">Recent Customer Enquiries</h2>
          <Link href="/admin/enquiries" className="text-sm font-semibold text-primary-600 hover:underline">
            View All →
          </Link>
        </div>

        {enquiries.length === 0 ? (
          <p className="text-sm text-surface-500 py-4 text-center">No enquiries received yet.</p>
        ) : (
          <div className="space-y-3">
            {enquiries.slice(0, 5).map((enq) => (
              <div key={enq.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-surface-50 border border-surface-200 gap-2">
                <div>
                  <span className="font-semibold text-surface-900 text-sm">{enq.name}</span>
                  <span className="text-xs text-surface-500 ml-2">({enq.phone})</span>
                  <p className="text-xs text-surface-600 mt-0.5 line-clamp-1">
                    {enq.productNameSnapshot ? `Product: ${enq.productNameSnapshot} — ` : ''}{enq.message}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                    enq.status === 'new' ? 'bg-purple-100 text-purple-800' :
                    enq.status === 'contacted' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {enq.status}
                  </span>
                  <span className="text-xs text-surface-400">
                    {new Date(enq.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
