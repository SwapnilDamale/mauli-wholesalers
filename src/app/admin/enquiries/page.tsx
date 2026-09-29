import { getEnquiries } from '@/lib/firebase/services';
import { requireAdmin } from '@/lib/admin-auth';
import AdminEnquiriesClient from './AdminEnquiriesClient';

export default async function AdminEnquiriesPage() {
  await requireAdmin();
  const enquiries = await getEnquiries();


  return (
    <div className="space-y-6">
      <AdminEnquiriesClient enquiries={enquiries} />
    </div>
  );
}
