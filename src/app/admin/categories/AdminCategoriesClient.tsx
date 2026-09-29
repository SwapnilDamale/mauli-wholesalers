'use client';

import { useState, useTransition } from 'react';
import type { Category } from '@/types';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { saveCategoryAction, deleteCategoryAction } from '@/actions/admin';

interface AdminCategoriesClientProps {
  categories: Category[];
}

export default function AdminCategoriesClient({ categories }: AdminCategoriesClientProps) {
  const [isPending, startTransition] = useTransition();
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenAdd = () => {
    setEditingCategory({
      name: { en: '', hi: '', mr: '' },
      slug: '',
      enabled: true,
      order: categories.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    startTransition(async () => {
      await deleteCategoryAction(id);
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    startTransition(async () => {
      const res = await saveCategoryAction(editingCategory);
      if (res.success) {
        setIsModalOpen(false);
        setEditingCategory(null);
      } else {
        alert(res.error || 'Failed to save category');
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Manage Categories</h1>
          <p className="text-sm text-surface-500">Organize product categories across English, Hindi, Marathi.</p>
        </div>
        <Button onClick={handleOpenAdd}>+ Add Category</Button>
      </div>

      <div className="bg-white rounded-xl border border-surface-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-100 text-surface-700 font-semibold border-b border-surface-200">
            <tr>
              <th className="p-4">Category Name (EN / HI / MR)</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Order</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-200">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-surface-50 transition">
                <td className="p-4 font-medium text-surface-900">
                  <div>{c.name.en}</div>
                  <div className="text-xs text-surface-500">{c.name.hi} • {c.name.mr}</div>
                </td>
                <td className="p-4 text-surface-600 font-mono">/{c.slug}</td>
                <td className="p-4 text-surface-600">{c.order}</td>
                <td className="p-4">
                  <Badge variant={c.enabled ? 'available' : 'outOfStock'}>
                    {c.enabled ? 'Active' : 'Disabled'}
                  </Badge>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => handleOpenEdit(c)}
                    className="text-xs font-semibold text-primary-600 hover:text-primary-800 bg-primary-50 px-2.5 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-xs font-semibold text-red-600 hover:text-red-800 bg-red-50 px-2.5 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-lg font-bold text-surface-900">
                {editingCategory.id ? 'Edit Category' : 'Add Category'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-surface-400 hover:text-surface-600">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-medium text-surface-700">Name (English) *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name?.en || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: { ...editingCategory.name!, en: e.target.value } })}
                  className="w-full mt-1 border rounded p-2"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-surface-700">Name (Hindi) *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name?.hi || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: { ...editingCategory.name!, hi: e.target.value } })}
                  className="w-full mt-1 border rounded p-2"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-surface-700">Name (Marathi) *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name?.mr || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: { ...editingCategory.name!, mr: e.target.value } })}
                  className="w-full mt-1 border rounded p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-surface-700">Slug *</label>
                  <input
                    type="text"
                    required
                    value={editingCategory.slug || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="w-full mt-1 border rounded p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-700">Display Order</label>
                  <input
                    type="number"
                    value={editingCategory.order ?? 1}
                    onChange={(e) => setEditingCategory({ ...editingCategory, order: parseInt(e.target.value) || 1 })}
                    className="w-full mt-1 border rounded p-2"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={editingCategory.enabled ?? true}
                  onChange={(e) => setEditingCategory({ ...editingCategory, enabled: e.target.checked })}
                  className="rounded text-primary-600"
                />
                Enabled (Visible in category list)
              </label>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" loading={isPending}>
                  Save Category
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
