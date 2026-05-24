'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, ExternalLink, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

interface Owner { name: string; email: string }
interface Store {
  _id: string;
  name: string;
  slug: string;
  businessType: string;
  isActive: boolean;
  ownerId: Owner;
  createdAt: string;
}

export default function AdminStoresPage() {
  const [stores,  setStores]  = useState<Store[]>([]);
  const [total,   setTotal]   = useState(0);
  const [page,    setPage]    = useState(1);
  const [q,       setQ]       = useState('');
  const [loading, setLoading] = useState(true);
  const [acting,  setActing]  = useState<string | null>(null);

  const PAGE_SIZE = 20;

  const load = useCallback(async (p = 1, query = q) => {
    setLoading(true);
    const r = await fetch(`/api/admin/stores?page=${p}&q=${encodeURIComponent(query)}`);
    const d = await r.json();
    setStores(d.stores ?? []);
    setTotal(d.total ?? 0);
    setLoading(false);
  }, [q]);

  useEffect(() => { load(1, ''); }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    load(1, q);
  }

  async function toggleActive(id: string, current: boolean) {
    setActing(id);
    await fetch(`/api/admin/stores/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !current }),
    });
    await load(page, q);
    setActing(null);
  }

  async function remove(id: string, name: string) {
    if (!confirm(`"${name}" store ko delete karein?`)) return;
    setActing(id);
    await fetch(`/api/admin/stores/${id}`, { method: 'DELETE' });
    await load(page, q);
    setActing(null);
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Stores</h1>
        <p className="text-gray-500 text-sm">{total} total stores</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={q} onChange={e => setQ(e.target.value)}
            placeholder="Store name ya slug se dhundein..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/60 transition" />
        </div>
        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-xl transition text-sm">
          Search
        </button>
      </form>

      {loading ? (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => <div key={i} className="bg-white/5 rounded-xl h-20 animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-2">
          {stores.map(s => (
            <div key={s._id}
              className="flex flex-col sm:flex-row sm:items-center justify-between bg-white/5 border border-white/10 rounded-xl px-5 py-4 gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white font-semibold text-sm truncate">{s.name}</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0
                    ${s.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {s.isActive ? 'Live' : 'Paused'}
                  </span>
                </div>
                <p className="text-green-400 text-xs mt-0.5">/store/{s.slug}</p>
                <p className="text-gray-500 text-xs mt-0.5">
                  Owner: {s.ownerId?.name} ({s.ownerId?.email})
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* View store */}
                <a href={`/store/${s.slug}`} target="_blank"
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition">
                  <ExternalLink className="w-3.5 h-3.5 text-gray-300" />
                </a>

                {/* Toggle active */}
                <button onClick={() => toggleActive(s._id, s.isActive)} disabled={acting === s._id}
                  title={s.isActive ? 'Pause store' : 'Activate store'}
                  className="w-8 h-8 bg-blue-500/20 hover:bg-blue-500/40 rounded-lg flex items-center justify-center transition disabled:opacity-40">
                  {s.isActive
                    ? <ToggleRight className="w-4 h-4 text-blue-400" />
                    : <ToggleLeft  className="w-4 h-4 text-blue-400" />}
                </button>

                {/* Delete */}
                <button onClick={() => remove(s._id, s.name)} disabled={acting === s._id}
                  className="w-8 h-8 bg-red-500/10 hover:bg-red-500/30 rounded-lg flex items-center justify-center transition disabled:opacity-40">
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => { setPage(i + 1); load(i + 1, q); }}
              className={`w-9 h-9 rounded-lg text-sm font-bold transition
                ${page === i + 1 ? 'bg-green-600 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
