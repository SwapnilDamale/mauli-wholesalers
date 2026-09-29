'use client';

import { useState, useTransition } from 'react';
import type { Product, Category } from '@/types';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { saveProductAction, deleteProductAction } from '@/actions/admin';

interface AdminProductsClientProps {
  products: Product[];
  categories: Category[];
}

export default function AdminProductsClient({ products, categories }: AdminProductsClientProps) {
  const [isPending, startTransition] = useTransition();
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredProducts = products.filter((p) =>
    p.name.en.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingProduct({
      name: { en: '', hi: '', mr: '' },
      description: { en: '', hi: '', mr: '' },
      slug: '',
      categoryId: categories[0]?.id || 'vegetables',
      unit: 'kg',
      price: 0,
      priceVisible: true,
      minWholesaleQty: 10,
      images: ['/placeholder-product.svg'],
      available: true,
      seasonal: false,
      featured: false,
      order: products.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    startTransition(async () => {
      await deleteProductAction(id);
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    startTransition(async () => {
      const res = await saveProductAction(editingProduct);
      if (res.success) {
        setIsModalOpen(false);
        setEditingProduct(null);
      } else {
        alert(res.error || 'Failed to save product');
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Manage Products</h1>
          <p className="text-sm text-surface-500">Add, edit, or remove catalogue items.</p>
        </div>
        <Button onClick={handleOpenAdd}>+ Add New Product</Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-surface-200">
        <input
          type="text"
          placeholder="Filter products by English name or slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Products Table (Desktop) & Cards (Mobile) */}
      <div className="bg-white rounded-xl border border-surface-200 overflow-hidden shadow-sm">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-100 text-surface-700 font-semibold border-b border-surface-200">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price / Unit</th>
                <th className="p-4">Min Qty</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-surface-50 transition">
                  <td className="p-4 font-medium text-surface-900">
                    <div>{p.name.en}</div>
                    <div className="text-xs text-surface-400 font-mono">/{p.slug}</div>
                  </td>
                  <td className="p-4 text-surface-600">
                    {categories.find((c) => c.id === p.categoryId)?.name.en || p.categoryId}
                  </td>
                  <td className="p-4 font-semibold text-surface-900">
                    {p.priceVisible && p.price != null ? `₹${p.price} / ${p.unit}` : 'Enquire'}
                  </td>
                  <td className="p-4 text-surface-600">{p.minWholesaleQty} {p.unit}</td>
                  <td className="p-4">
                    <Badge variant={p.available ? 'available' : 'outOfStock'}>
                      {p.available ? 'Available' : 'Out of Stock'}
                    </Badge>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="text-xs font-semibold text-primary-600 hover:text-primary-800 bg-primary-50 px-2.5 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
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

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-surface-200">
          {filteredProducts.map((p) => (
            <div key={p.id} className="p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-surface-900">{p.name.en}</h3>
                  <p className="text-xs text-surface-500 font-mono">/{p.slug}</p>
                </div>
                <Badge variant={p.available ? 'available' : 'outOfStock'}>
                  {p.available ? 'Available' : 'Out of Stock'}
                </Badge>
              </div>
              <div className="text-xs text-surface-600 flex justify-between">
                <span>Price: {p.priceVisible && p.price != null ? `₹${p.price}/${p.unit}` : 'Enquire'}</span>
                <span>Min Qty: {p.minWholesaleQty} {p.unit}</span>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-surface-100">
                <button
                  onClick={() => handleOpenEdit(p)}
                  className="text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Form Modal */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-lg font-bold text-surface-900">
                {editingProduct.id ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-surface-400 hover:text-surface-600">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-surface-700">Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name?.en || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: { ...editingProduct.name!, en: e.target.value } })}
                    className="w-full mt-1 border rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-700">Name (Hindi) *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name?.hi || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: { ...editingProduct.name!, hi: e.target.value } })}
                    className="w-full mt-1 border rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-700">Name (Marathi) *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name?.mr || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: { ...editingProduct.name!, mr: e.target.value } })}
                    className="w-full mt-1 border rounded p-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-surface-700">Slug (URL identifier) *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.slug || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="w-full mt-1 border rounded p-2 text-sm font-mono"
                    placeholder="onion"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-700">Category *</label>
                  <select
                    value={editingProduct.categoryId || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                    className="w-full mt-1 border rounded p-2 text-sm"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name.en}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-surface-700">Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.price ?? ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full mt-1 border rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-700">Unit</label>
                  <select
                    value={editingProduct.unit || 'kg'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value as any })}
                    className="w-full mt-1 border rounded p-2 text-sm"
                  >
                    <option value="kg">kg</option>
                    <option value="quintal">quintal</option>
                    <option value="dozen">dozen</option>
                    <option value="box">box</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-700">Min Wholesale Qty</label>
                  <input
                    type="number"
                    value={editingProduct.minWholesaleQty ?? 1}
                    onChange={(e) => setEditingProduct({ ...editingProduct, minWholesaleQty: parseInt(e.target.value) || 1 })}
                    className="w-full mt-1 border rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-700">Display Order</label>
                  <input
                    type="number"
                    value={editingProduct.order ?? 1}
                    onChange={(e) => setEditingProduct({ ...editingProduct, order: parseInt(e.target.value) || 1 })}
                    className="w-full mt-1 border rounded p-2 text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.priceVisible ?? true}
                    onChange={(e) => setEditingProduct({ ...editingProduct, priceVisible: e.target.checked })}
                    className="rounded text-primary-600"
                  />
                  Price Visible
                </label>
                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.available ?? true}
                    onChange={(e) => setEditingProduct({ ...editingProduct, available: e.target.checked })}
                    className="rounded text-primary-600"
                  />
                  Available in Stock
                </label>
                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.seasonal ?? false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, seasonal: e.target.checked })}
                    className="rounded text-primary-600"
                  />
                  Seasonal Product
                </label>
                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.featured ?? false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                    className="rounded text-primary-600"
                  />
                  Featured on Homepage
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium text-surface-700">Image URL</label>
                <input
                  type="text"
                  value={editingProduct.images?.[0] || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                  className="w-full mt-1 border rounded p-2 text-sm font-mono"
                  placeholder="/placeholder-product.svg or Firebase Storage URL"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-surface-700">Description (EN)</label>
                  <textarea
                    rows={3}
                    value={editingProduct.description?.en || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: { ...editingProduct.description!, en: e.target.value } })}
                    className="w-full mt-1 border rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-700">Description (HI)</label>
                  <textarea
                    rows={3}
                    value={editingProduct.description?.hi || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: { ...editingProduct.description!, hi: e.target.value } })}
                    className="w-full mt-1 border rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-700">Description (MR)</label>
                  <textarea
                    rows={3}
                    value={editingProduct.description?.mr || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: { ...editingProduct.description!, mr: e.target.value } })}
                    className="w-full mt-1 border rounded p-2 text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" loading={isPending}>
                  Save Product
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
