'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Shield, ShieldOff, Trash2, UserCheck, UserX } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'client' | 'admin';
  status: 'pending' | 'approved' | 'blocked';
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users,   setUsers]   = useState<User[]>([]);
  const [total,   setTotal]   = useState(0);
  const [page,    setPage]    = useState(1);
  const [q,       setQ]       = useState('');
  const [loading, setLoading] = useState(true);
  const [acting,  setActing]  = useState<string | null>(null);

  const PAGE_SIZE = 20;

  const load = useCallback(async (p = 1, query = q) => {
    setLoading(true);
    const r = await fetch(`/api/admin/users?page=${p}&q=${encodeURIComponent(query)}`);
    const d = await r.json();
    setUsers(d.users ?? []);
    setTotal(d.total ?? 0);
    setLoading(false);
  }, [q]);

  useEffect(() => { load(1, ''); }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    load(1, q);
  }

  async function patch(id: string, body: object) {
    setActing(id);
    await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    await load(page, q);
    setActing(null);
  }

  async function remove(id: string, name: string) {
    if (!confirm(`"${name}" ko delete karein? Ye undo nahi ho ga.`)) return;
    setActing(id);
    await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    await load(page, q);
    setActing(null);
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Users</h1>
          <p className="text-gray-500 text-sm">{total} total users</p>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={q} onChange={e => setQ(e.target.value)}
            placeholder="Name ya email se dhundein..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/60 transition" />
        </div>
        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-xl transition text-sm">
          Search
        </button>
      </form>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => <div key={i} className="bg-white/5 rounded-xl h-16 animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-2">
          {users.map(u => (
            <div key={u._id}
              className="flex flex-col sm:flex-row sm:items-center justify-between bg-white/5 border border-white/10 rounded-xl px-5 py-4 gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center shrink-0 text-white font-black text-sm">
                  {u.name[0]?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{u.name}</p>
                  <p className="text-gray-500 text-xs truncate">{u.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                  ${u.role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  {u.role}
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                  ${u.status === 'approved' ? 'bg-green-500/20 text-green-400'
                    : u.status === 'blocked' ? 'bg-red-500/20 text-red-400'
                    : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {u.status}
                </span>

                {/* Block / Unblock */}
                {u.status !== 'blocked' ? (
                  <button onClick={() => patch(u._id, { status: 'blocked' })} disabled={acting === u._id}
                    title="Block user"
                    className="w-8 h-8 bg-red-500/20 hover:bg-red-500/40 rounded-lg flex items-center justify-center transition disabled:opacity-40">
                    <UserX className="w-3.5 h-3.5 text-red-400" />
                  </button>
                ) : (
                  <button onClick={() => patch(u._id, { status: 'approved' })} disabled={acting === u._id}
                    title="Unblock user"
                    className="w-8 h-8 bg-green-500/20 hover:bg-green-500/40 rounded-lg flex items-center justify-center transition disabled:opacity-40">
                    <UserCheck className="w-3.5 h-3.5 text-green-400" />
                  </button>
                )}

                {/* Make admin / Remove admin */}
                {u.role !== 'admin' ? (
                  <button onClick={() => patch(u._id, { role: 'admin' })} disabled={acting === u._id}
                    title="Make admin"
                    className="w-8 h-8 bg-purple-500/20 hover:bg-purple-500/40 rounded-lg flex items-center justify-center transition disabled:opacity-40">
                    <Shield className="w-3.5 h-3.5 text-purple-400" />
                  </button>
                ) : (
                  <button onClick={() => patch(u._id, { role: 'client' })} disabled={acting === u._id}
                    title="Remove admin"
                    className="w-8 h-8 bg-orange-500/20 hover:bg-orange-500/40 rounded-lg flex items-center justify-center transition disabled:opacity-40">
                    <ShieldOff className="w-3.5 h-3.5 text-orange-400" />
                  </button>
                )}

                {/* Delete */}
                <button onClick={() => remove(u._id, u.name)} disabled={acting === u._id}
                  title="Delete user"
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
