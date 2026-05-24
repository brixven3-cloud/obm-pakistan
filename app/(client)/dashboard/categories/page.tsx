'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Check, Tag } from 'lucide-react';

interface Category { _id: string; name: string; description?: string }

export default function CategoriesPage() {
  const [cats,     setCats]     = useState<Category[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState<'add' | 'edit' | null>(null);
  const [editing,  setEditing]  = useState<Category | null>(null);
  const [form,     setForm]     = useState({ name: '', description: '' });
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error,    setError]    = useState('');

  async function load() {
    setLoading(true);
    const r = await fetch('/api/categories');
    const d = await r.json();
    setCats(d.categories ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setForm({ name: '', description: '' });
    setError(''); setModal('add');
  }

  function openEdit(c: Category) {
    setEditing(c);
    setForm({ name: c.name, description: c.description ?? '' });
    setError(''); setModal('edit');
  }

  function closeModal() { setModal(null); setEditing(null); setError(''); }

  async function handleSave() {
    if (!form.name.trim()) { setError('Category name zaroor likhein'); return; }
    setSaving(true); setError('');

    const method = modal === 'add' ? 'POST' : 'PATCH';
    const url    = modal === 'add' ? '/api/categories' : `/api/categories/${editing?._id}`;

    const r = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const d = await r.json();
    if (!r.ok) { setError(d.error); setSaving(false); return; }

    closeModal();
    load();
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Is category ko delete karein?')) return;
    setDeleting(id);
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    setDeleting(null);
    load();
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Categories</h1>
          <p className="text-gray-500 text-sm">{cats.length} categories</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2.5 rounded-xl transition text-sm">
          <Plus className="w-4 h-4" /> New Category
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-white/5 rounded-xl h-16 animate-pulse" />)}
        </div>
      ) : cats.length === 0 ? (
        <div className="text-center py-20">
          <Tag className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 font-semibold">Koi category nahi</p>
          <p className="text-gray-600 text-sm mt-1">+ New Category se pehli category banayein</p>
        </div>
      ) : (
        <div className="space-y-2">
          {cats.map(c => (
            <div key={c._id} className="flex items-center justify-between bg-white/5 border border-white/10 hover:border-green-500/20 rounded-xl px-5 py-4 transition group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-green-600/20 border border-green-500/20 rounded-lg flex items-center justify-center">
                  <Tag className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{c.name}</p>
                  {c.description && <p className="text-gray-500 text-xs mt-0.5">{c.description}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                <button onClick={() => openEdit(c)} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition">
                  <Pencil className="w-3.5 h-3.5 text-gray-300" />
                </button>
                <button onClick={() => handleDelete(c._id)} disabled={deleting === c._id}
                  className="w-8 h-8 bg-red-500/20 hover:bg-red-500/40 rounded-lg flex items-center justify-center transition disabled:opacity-50">
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal ── */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-sm">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h2 className="font-black text-white">{modal === 'add' ? 'New Category' : 'Category Edit Karein'}</h2>
              <button onClick={closeModal}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <div className="p-5 space-y-4">
              {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">{error}</div>}

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Category Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Samsung, Casual Wear, Perfumes..."
                  onKeyDown={e => e.key === 'Enter' && handleSave()}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/60 transition" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Description (optional)</label>
                <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Short description..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/60 transition" />
              </div>
            </div>

            <div className="flex gap-3 p-5 border-t border-white/10">
              <button onClick={closeModal} className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl transition text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-black py-3 rounded-xl transition text-sm">
                {saving ? 'Saving...' : <><Check className="w-4 h-4" /> {modal === 'add' ? 'Banayein' : 'Update'}</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
