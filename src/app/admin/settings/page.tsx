import { getBusinessSettings } from '@/lib/firebase/services';
import { requireAdmin } from '@/lib/admin-auth';
import AdminSettingsClient from './AdminSettingsClient';

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await getBusinessSettings();


  return (
    <div className="space-y-6">
      <AdminSettingsClient settings={settings} />
    </div>
  );
}
