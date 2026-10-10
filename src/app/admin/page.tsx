import { getAllProducts, getAllCategories, getEnquiries } from '@/lib/firebase/services';
import { requireAdmin } from '@/lib/admin-auth';
import AdminDashboardClient from './AdminDashboardClient';

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [products, categories, enquiries] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
    getEnquiries(),
  ]);

  return (
    <AdminDashboardClient
      products={products}
      categories={categories}
      initialEnquiries={enquiries}
    />
  );
}
