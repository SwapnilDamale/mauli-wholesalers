import { getAllCategories } from '@/lib/firebase/services';
import { requireAdmin } from '@/lib/admin-auth';
import AdminCategoriesClient from './AdminCategoriesClient';

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const categories = await getAllCategories();


  return (
    <div className="space-y-6">
      <AdminCategoriesClient categories={categories} />
    </div>
  );
}
