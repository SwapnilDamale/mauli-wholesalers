'use client';

import { useState, useEffect } from 'react';
import type { Enquiry } from '@/types';
import { db } from '@/lib/firebase/config';
import { collection, query, orderBy, limit, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { updateEnquiryStatusAction } from '@/actions/admin';

interface AdminEnquiriesClientProps {
  enquiries: Enquiry[];
}

export default function AdminEnquiriesClient({ enquiries }: AdminEnquiriesClientProps) {
  const [items, setItems] = useState<Enquiry[]>(enquiries);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(enquiries.length === 0);

  // Live real-time sync with Google Cloud Firestore
  useEffect(() => {
    try {
      const q = query(collection(db, 'enquiries'), orderBy('createdAt', 'desc'), limit(100));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const loaded: Enquiry[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            let date = new Date();
            if (data.createdAt?.toDate) {
              date = data.createdAt.toDate();
            } else if (data.createdAt) {
              date = new Date(data.createdAt);
            }
            return {
              id: docSnap.id,
              name: data.name || '',
              phone: data.phone || '',
              email: data.email || null,
              productId: data.productId || null,
              productNameSnapshot: data.productNameSnapshot || '',
              quantity: data.quantity || null,
              message: data.message || '',
              language: data.language || 'mr',
              status: data.status || 'new',
              createdAt: date,
            };
          });
          setItems(loaded);
          setLoading(false);
        },
        (err) => {
          console.warn('Realtime enquiry listener note:', err.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn('Could not attach Firestore listener:', err);
      setLoading(false);
    }
  }, []);

  const filtered = items.filter((e) => filterStatus === 'all' || e.status === filterStatus);

  const handleStatusChange = async (id: string, status: 'new' | 'contacted' | 'closed') => {
    // Optimistic UI update
    setItems((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    try {
      await updateDoc(doc(db, 'enquiries', id), { status });
    } catch {
      // Fallback to server action
      await updateEnquiryStatusAction(id, status);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-surface-900">Customer Enquiries</h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Live Sync
            </span>
          </div>
          <p className="text-sm text-surface-500 mt-0.5">
            Real-time customer leads and wholesale quotes from your website.
          </p>
        </div>
        <div className="flex gap-2">
          {['all', 'new', 'contacted', 'closed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                filterStatus === status
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white border border-surface-300 text-surface-700 hover:bg-surface-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-surface-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-surface-500">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary-600 border-t-transparent mb-2"></div>
            <p className="text-sm">Connecting to live Firestore enquiries...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-surface-500 text-sm">
            No enquiries match the selected filter.
          </div>
        ) : (
          <div className="divide-y divide-surface-200">
            {filtered.map((enq) => (
              <div key={enq.id} className="p-5 space-y-3 hover:bg-surface-50 transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-bold text-surface-900 text-base">{enq.name}</span>
                    <a
                      href={`tel:${enq.phone}`}
                      className="inline-flex items-center gap-1 rounded-md bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700 hover:bg-primary-100"
                    >
                      📞 {enq.phone}
                    </a>
                    <a
                      href={`https://wa.me/${enq.phone.replace(/[^+\d]/g, '')}?text=${encodeURIComponent(`नमस्कार ${enq.name}, माऊली होलसेलर्सकडून आपल्या चौकशीबद्दल...`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 hover:bg-green-100"
                    >
                      💬 WhatsApp
                    </a>
                    {enq.email && (
                      <a href={`mailto:${enq.email}`} className="text-xs text-surface-500 hover:underline">
                        ✉️ {enq.email}
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-surface-400">Lang: {enq.language.toUpperCase()}</span>
                    <span className="text-xs text-surface-400">
                      {new Date(enq.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-surface-700 bg-surface-50 p-3.5 rounded-lg border border-surface-200">
                  {enq.productNameSnapshot && (
                    <p className="font-semibold text-primary-800 mb-1">
                      📦 Commodity: {enq.productNameSnapshot} {enq.quantity ? `• Qty: ${enq.quantity}` : ''}
                    </p>
                  )}
                  <p className="whitespace-pre-wrap text-surface-800">{enq.message}</p>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-surface-500 font-medium">Status:</span>
                  <div className="flex gap-2">
                    {(['new', 'contacted', 'closed'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(enq.id, st)}
                        className={`px-3 py-1 rounded font-medium capitalize transition ${
                          enq.status === st
                            ? st === 'new'
                              ? 'bg-purple-600 text-white'
                              : st === 'contacted'
                              ? 'bg-amber-600 text-white'
                              : 'bg-green-600 text-white'
                            : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
