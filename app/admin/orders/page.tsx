'use client';

import { useState, useEffect, useCallback } from 'react';
import { ShoppingBag } from 'lucide-react';

interface StoreRef { name: string; slug: string }
interface OrderItem { title: string; qty: number; price: number }
interface Order {
  _id: string;
  storeId: StoreRef;
  customer: { name: string; phone: string; address: string };
  items: OrderItem[];
  total: number;
  status: 'new' | 'seen' | 'fulfilled';
  createdAt: string;
}

const STATUS_FILTERS = [
  { value: '',          label: 'All'       },
  { value: 'new',       label: 'New'       },
  { value: 'seen',      label: 'Seen'      },
  { value: 'fulfilled', label: 'Fulfilled' },
];

export default function AdminOrdersPage() {
  const [orders,  setOrders]  = useState<Order[]>([]);
  const [total,   setTotal]   = useState(0);
  const [page,    setPage]    = useState(1);
  const [status,  setStatus]  = useState('');
  const [loading, setLoading] = useState(true);

  const PAGE_SIZE = 20;

  const load = useCallback(async (p = 1, s = status) => {
    setLoading(true);
    const r = await fetch(`/api/admin/orders?page=${p}&status=${s}`);
    const d = await r.json();
    setOrders(d.orders ?? []);
    setTotal(d.total ?? 0);
    setLoading(false);
  }, [status]);

  useEffect(() => { load(1, ''); }, []);

  function changeStatus(s: string) {
    setStatus(s);
    setPage(1);
    load(1, s);
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Orders</h1>
        <p className="text-gray-500 text-sm">{total} total orders</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_FILTERS.map(f => (
          <button key={f.value} onClick={() => changeStatus(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition
              ${status === f.value ? 'bg-green-600 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="bg-white/5 rounded-xl h-24 animate-pulse" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 font-semibold">Koi orders nahi</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(o => (
            <div key={o._id} className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-white font-bold text-sm">{o.customer.name}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                      ${o.status === 'new'       ? 'bg-blue-500/20 text-blue-400'
                        : o.status === 'seen'    ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-green-500/20 text-green-400'}`}>
                      {o.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs mt-0.5">{o.customer.phone} — {o.customer.address}</p>
                  <p className="text-green-400 text-xs mt-0.5">
                    Store: {o.storeId?.name ?? 'Unknown'} (/store/{o.storeId?.slug})
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-white font-black text-lg">Rs {o.total.toLocaleString()}</p>
                  <p className="text-gray-600 text-xs">{new Date(o.createdAt).toLocaleDateString('en-PK')}</p>
                </div>
              </div>

              {/* Items */}
              <div className="border-t border-white/10 pt-3 space-y-1">
                {o.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span className="text-gray-400">{item.title} × {item.qty}</span>
                    <span className="text-gray-300">Rs {(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
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
