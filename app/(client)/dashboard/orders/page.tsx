'use client';

import { useState, useEffect, useCallback } from 'react';
import { ShoppingBag, Check, Eye } from 'lucide-react';

interface OrderItem { title: string; qty: number; price: number }
interface Order {
  _id: string;
  customer: { name: string; phone: string; address: string };
  items: OrderItem[];
  total: number;
  status: 'new' | 'seen' | 'fulfilled';
  createdAt: string;
}

const STATUS_TABS = [
  { value: '',          label: 'All'       },
  { value: 'new',       label: 'New'       },
  { value: 'seen',      label: 'Seen'      },
  { value: 'fulfilled', label: 'Fulfilled' },
];

export default function OrdersPage() {
  const [orders,  setOrders]  = useState<Order[]>([]);
  const [total,   setTotal]   = useState(0);
  const [page,    setPage]    = useState(1);
  const [status,  setStatus]  = useState('');
  const [loading, setLoading] = useState(true);
  const [acting,  setActing]  = useState<string | null>(null);

  const PAGE_SIZE = 20;

  const load = useCallback(async (p = 1, s = status) => {
    setLoading(true);
    const r = await fetch(`/api/orders?page=${p}&status=${s}`);
    const d = await r.json();
    setOrders(d.orders ?? []);
    setTotal(d.total ?? 0);
    setLoading(false);
  }, [status]);

  useEffect(() => { load(1, ''); }, []);

  function changeStatus(s: string) {
    setStatus(s); setPage(1); load(1, s);
  }

  async function updateStatus(id: string, newStatus: 'seen' | 'fulfilled') {
    setActing(id);
    await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    await load(page, status);
    setActing(null);
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Orders</h1>
        <p className="text-gray-500 text-sm">{total} total orders</p>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_TABS.map(t => (
          <button key={t.value} onClick={() => changeStatus(t.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition
              ${status === t.value ? 'bg-green-600 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-white/5 rounded-xl h-28 animate-pulse" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 font-semibold">Koi orders nahi</p>
          <p className="text-gray-600 text-sm mt-1">Jab customer order karega, yahan dikhega</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(o => (
            <div key={o._id} className="bg-white/5 border border-white/10 rounded-xl px-4 sm:px-5 py-4 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-white font-bold text-sm">{o.customer.name}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0
                      ${o.status === 'new'       ? 'bg-blue-500/20  text-blue-400'
                        : o.status === 'seen'    ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-green-500/20 text-green-400'}`}>
                      {o.status === 'new' ? '🔵 New' : o.status === 'seen' ? '👁 Seen' : '✅ Done'}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs mt-0.5">{o.customer.phone}</p>
                  <p className="text-gray-600 text-xs mt-0.5 truncate">{o.customer.address}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-white font-black text-lg">Rs {o.total.toLocaleString()}</p>
                  <p className="text-gray-600 text-xs">{new Date(o.createdAt).toLocaleDateString('en-PK')}</p>
                </div>
              </div>

              {/* Items */}
              <div className="border-t border-white/10 pt-2 space-y-1">
                {o.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="text-gray-400">{item.title} × {item.qty}</span>
                    <span className="text-gray-300 font-semibold">Rs {(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                {o.status === 'new' && (
                  <button onClick={() => updateStatus(o._id, 'seen')} disabled={acting === o._id}
                    className="flex items-center gap-1.5 text-xs font-semibold bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 px-3 py-1.5 rounded-lg transition disabled:opacity-40">
                    <Eye className="w-3.5 h-3.5" /> Mark Seen
                  </button>
                )}
                {o.status !== 'fulfilled' && (
                  <button onClick={() => updateStatus(o._id, 'fulfilled')} disabled={acting === o._id}
                    className="flex items-center gap-1.5 text-xs font-semibold bg-green-500/20 hover:bg-green-500/30 text-green-400 px-3 py-1.5 rounded-lg transition disabled:opacity-40">
                    <Check className="w-3.5 h-3.5" /> Complete
                  </button>
                )}
                <a href={`https://wa.me/${o.customer.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-gray-300 px-3 py-1.5 rounded-lg transition ml-auto">
                  WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => { setPage(i + 1); load(i + 1, status); }}
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
