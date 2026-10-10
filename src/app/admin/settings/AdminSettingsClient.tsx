'use client';

import { useState, useTransition } from 'react';
import type { BusinessSettings } from '@/types';
import Button from '@/components/ui/Button';
import { saveSettingsAction } from '@/actions/admin';
import { db } from '@/lib/firebase/config';
import { doc, setDoc } from 'firebase/firestore';

interface AdminSettingsClientProps {
  settings: BusinessSettings;
}

export default function AdminSettingsClient({ settings: initialSettings }: AdminSettingsClientProps) {
  const [isPending, startTransition] = useTransition();
  const [settings, setSettings] = useState<BusinessSettings>(initialSettings);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(false);

    startTransition(async () => {
      try {
        await setDoc(doc(db, 'settings', 'business'), settings, { merge: true });
      } catch (clientErr) {
        console.warn('Client direct save note:', clientErr);
      }

      const res = await saveSettingsAction(settings);
      if (res.success) {
        setSuccessMsg(true);
        setTimeout(() => setSuccessMsg(false), 4000);
      } else {
        alert(res.error || 'Failed to save settings');
      }
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Business Settings</h1>
        <p className="text-sm text-surface-500">Update business details, contact info, and multilang about copy.</p>
      </div>

      {successMsg && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 text-sm rounded-xl">
          Settings updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-surface-200 space-y-6 text-sm">
        <div className="space-y-4">
          <h2 className="text-base font-bold text-surface-900 border-b pb-2">General & Contact Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-surface-700">Business Name</label>
              <input
                type="text"
                required
                value={settings.businessName}
                onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                className="w-full mt-1 border rounded p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-700">Email Address</label>
              <input
                type="email"
                required
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full mt-1 border rounded p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-700">Phone Number</label>
              <input
                type="text"
                required
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full mt-1 border rounded p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-700">WhatsApp Number (e.g. 919876543210)</label>
              <input
                type="text"
                required
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                className="w-full mt-1 border rounded p-2 text-sm font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-surface-700">Physical Address</label>
            <input
              type="text"
              required
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full mt-1 border rounded p-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-surface-700">Google Maps URL</label>
            <input
              type="text"
              required
              value={settings.mapsUrl}
              onChange={(e) => setSettings({ ...settings, mapsUrl: e.target.value })}
              className="w-full mt-1 border rounded p-2 text-sm font-mono"
            />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h2 className="text-base font-bold text-surface-900 border-b pb-2">About Us Text (Multilingual)</h2>

          <div>
            <label className="block text-xs font-medium text-surface-700">About (English)</label>
            <textarea
              rows={3}
              value={settings.aboutText.en}
              onChange={(e) => setSettings({ ...settings, aboutText: { ...settings.aboutText, en: e.target.value } })}
              className="w-full mt-1 border rounded p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-surface-700">About (Hindi)</label>
            <textarea
              rows={3}
              value={settings.aboutText.hi}
              onChange={(e) => setSettings({ ...settings, aboutText: { ...settings.aboutText, hi: e.target.value } })}
              className="w-full mt-1 border rounded p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-surface-700">About (Marathi)</label>
            <textarea
              rows={3}
              value={settings.aboutText.mr}
              onChange={(e) => setSettings({ ...settings, aboutText: { ...settings.aboutText, mr: e.target.value } })}
              className="w-full mt-1 border rounded p-2 text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button type="submit" loading={isPending}>
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
