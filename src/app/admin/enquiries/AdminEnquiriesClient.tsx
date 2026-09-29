'use client';

import { useState, useTransition } from 'react';
import type { Enquiry } from '@/types';
import { updateEnquiryStatusAction } from '@/actions/admin';

interface AdminEnquiriesClientProps {
  enquiries: Enquiry[];
}

export default function AdminEnquiriesClient({ enquiries }: AdminEnquiriesClientProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isPending, startTransition] = useTransition();

  const filtered = enquiries.filter((e) => filterStatus === 'all' || e.status === filterStatus);

  const handleStatusChange = (id: string, status: 'new' | 'contacted' | 'closed') => {
    startTransition(async () => {
      await updateEnquiryStatusAction(id, status);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Customer Enquiries</h1>
          <p className="text-sm text-surface-500">Track and manage customer leads and wholesale requests.</p>
        </div>
        <div className="flex gap-2">
          {['all', 'new', 'contacted', 'closed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                filterStatus === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-surface-300 text-surface-700 hover:bg-surface-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-surface-200 overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-surface-500 text-sm">
            No enquiries match the selected filter.
          </div>
        ) : (
          <div className="divide-y divide-surface-200">
            {filtered.map((enq) => (
              <div key={enq.id} className="p-5 space-y-3 hover:bg-surface-50 transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-surface-900">{enq.name}</span>
                    <a href={`tel:${enq.phone}`} className="text-sm font-semibold text-primary-600 ml-3 hover:underline">
                      📞 {enq.phone}
                    </a>
                    {enq.email && (
                      <a href={`mailto:${enq.email}`} className="text-xs text-surface-500 ml-3 hover:underline">
                        ✉️ {enq.email}
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-surface-400">Language: {enq.language.toUpperCase()}</span>
                    <span className="text-xs text-surface-400">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-surface-700 bg-surface-50 p-3 rounded-lg border border-surface-200">
                  {enq.productNameSnapshot && (
                    <p className="font-semibold text-primary-700 mb-1">
                      Product Interest: {enq.productNameSnapshot} {enq.quantity ? `(Qty: ${enq.quantity})` : ''}
                    </p>
                  )}
                  <p className="whitespace-pre-wrap">{enq.message}</p>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-surface-500">Status Update:</span>
                  <div className="flex gap-2">
                    {(['new', 'contacted', 'closed'] as const).map((st) => (
                      <button
                        key={st}
                        disabled={isPending}
                        onClick={() => handleStatusChange(enq.id, st)}
                        className={`px-3 py-1 rounded font-medium capitalize transition ${
                          enq.status === st
                            ? 'bg-surface-900 text-white'
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
