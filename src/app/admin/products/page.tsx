import { getAllProducts, getAllCategories } from '@/lib/firebase/services';
import { requireAdmin } from '@/lib/admin-auth';
import AdminProductsClient from './AdminProductsClient';

export default async function AdminProductsPage() {
  await requireAdmin();
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
  ]);


  return (
    <div className="space-y-6">
      <AdminProductsClient products={products} categories={categories} />
    </div>
  );
}
