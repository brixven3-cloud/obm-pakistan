'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Plus, Pencil, Trash2, X, ImagePlus, Package } from 'lucide-react';

interface Category { _id: string; name: string }
interface Product  { _id: string; title: string; description?: string; price: number; images: string[]; inStock: boolean; categoryId?: string }

const EMPTY: Omit<Product, '_id'> = { title: '', description: '', price: 0, images: [], inStock: true, categoryId: '' };

export default function ProductsPage() {
  const [products,    setProducts]    = useState<Product[]>([]);
  const [categories,  setCategories]  = useState<Category[]>([]);
  const [total,       setTotal]       = useState(0);
  const [page,        setPage]        = useState(1);
  const [loading,     setLoading]     = useState(true);
  const [modal,       setModal]       = useState<'add' | 'edit' | null>(null);
  const [editing,     setEditing]     = useState<Product | null>(null);
  const [form,        setForm]        = useState<Omit<Product, '_id'>>(EMPTY);
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState('');
  const [uploading,   setUploading]   = useState(false);
  const [deleting,    setDeleting]    = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const PAGE_SIZE = 20;

  async function load(p = 1) {
    setLoading(true);
    const r = await fetch(`/api/products?page=${p}`);
    const d = await r.json();
    setProducts(d.products ?? []);
    setTotal(d.total ?? 0);
    setLoading(false);
  }

  async function loadCategories() {
    const r = await fetch('/api/categories');
    const d = await r.json();
    setCategories(d.categories ?? []);
  }

  useEffect(() => { load(); loadCategories(); }, []);

  function openAdd() {
    setForm(EMPTY); setError(''); setModal('add');
  }

  function openEdit(p: Product) {
    setEditing(p);
    setForm({ title: p.title, description: p.description ?? '', price: p.price, images: p.images, inStock: p.inStock, categoryId: p.categoryId ?? '' });
    setError(''); setModal('edit');
  }

  function closeModal() { setModal(null); setEditing(null); setError(''); }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const r = await fetch('/api/upload', { method: 'POST', body: fd });
    const d = await r.json();
    if (d.url) setForm(f => ({ ...f, images: [...f.images, d.url] }));
    else setError('Image upload failed');
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  function removeImage(url: string) {
    setForm(f => ({ ...f, images: f.images.filter(i => i !== url) }));
  }

  async function handleSave() {
    if (!form.title.trim()) { setError('Title zaroor likhein'); return; }
    if (form.price < 0)     { setError('Price galat hai'); return; }
    setSaving(true); setError('');

    const method = modal === 'add' ? 'POST' : 'PATCH';
    const url    = modal === 'add' ? '/api/products' : `/api/products/${editing?._id}`;

    const r = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, categoryId: form.categoryId || null }),
    });
    const d = await r.json();
    if (!r.ok) { setError(d.error); setSaving(false); return; }

    closeModal();
    load(page);
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Is product ko delete karein?')) return;
    setDeleting(id);
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    setDeleting(null);
    load(page);
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Products</h1>
          <p className="text-gray-500 text-sm">{total} products</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2.5 rounded-xl transition text-sm">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="bg-white/5 rounded-2xl h-52 animate-pulse" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 font-semibold">Koi product nahi</p>
          <p className="text-gray-600 text-sm mt-1">+ Add Product se pehla product add karein</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(p => (
            <div key={p._id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group">
              <div className="relative h-36 bg-white/5">
                {p.images[0] ? (
                  <Image src={p.images[0]} alt={p.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-8 h-8 text-gray-600" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  <button onClick={() => openEdit(p)} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition">
                    <Pencil className="w-3.5 h-3.5 text-white" />
                  </button>
                  <button onClick={() => handleDelete(p._id)} disabled={deleting === p._id} className="w-8 h-8 bg-red-500/70 hover:bg-red-500 rounded-lg flex items-center justify-center transition">
                    <Trash2 className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-white text-sm font-semibold truncate">{p.title}</p>
                <p className="text-green-400 text-sm font-black">Rs {p.price.toLocaleString()}</p>
                <span className={`text-xs font-semibold ${p.inStock ? 'text-green-500' : 'text-red-400'}`}>
                  {p.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => { setPage(i+1); load(i+1); }}
              className={`w-9 h-9 rounded-lg text-sm font-bold transition ${page === i+1 ? 'bg-green-600 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}>
              {i+1}
            </button>
          ))}
        </div>
      )}

      {/* ── Modal ── */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h2 className="font-black text-white">{modal === 'add' ? 'Product Add Karein' : 'Product Edit Karein'}</h2>
              <button onClick={closeModal}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <div className="p-5 space-y-4">
              {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">{error}</div>}

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Title *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="iPhone 14 Pro Max"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/60 transition" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Product ki details..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/60 transition resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Price (Rs) *</label>
                  <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} min={0} placeholder="25000"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/60 transition" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Category</label>
                  <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500/60 transition">
                    <option value="">-- None --</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              {/* In Stock Toggle */}
              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <span className="text-sm text-gray-300 font-semibold">In Stock</span>
                <button onClick={() => setForm(f => ({ ...f, inStock: !f.inStock }))}
                  className={`w-12 h-6 rounded-full transition-colors relative ${form.inStock ? 'bg-green-600' : 'bg-white/20'}`}>
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${form.inStock ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              {/* Images */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2">Images</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.images.map(url => (
                    <div key={url} className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/10">
                      <Image src={url} alt="" fill className="object-cover" />
                      <button onClick={() => removeImage(url)} className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center">
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => fileRef.current?.click()} disabled={uploading}
                    className="w-16 h-16 rounded-lg border-2 border-dashed border-white/20 hover:border-green-500/50 flex flex-col items-center justify-center gap-1 transition disabled:opacity-50">
                    <ImagePlus className="w-5 h-5 text-gray-500" />
                    <span className="text-[10px] text-gray-600">{uploading ? '...' : 'Add'}</span>
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-5 border-t border-white/10">
              <button onClick={closeModal} className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl transition text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-black py-3 rounded-xl transition text-sm">
                {saving ? 'Saving...' : modal === 'add' ? 'Add Karein' : 'Update Karein'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
