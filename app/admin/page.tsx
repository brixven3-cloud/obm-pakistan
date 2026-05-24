import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import Store from '@/lib/models/Store';
import Product from '@/lib/models/Product';
import Order from '@/lib/models/Order';
import Link from 'next/link';
import { Users, Store as StoreIcon, Package, ShoppingBag, TrendingUp, ArrowRight } from 'lucide-react';

export default async function AdminPage() {
  await connectDB();

  const [totalUsers, totalStores, totalProducts, totalOrders, recentUsers, revenue] = await Promise.all([
    User.countDocuments(),
    Store.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    User.find().sort({ createdAt: -1 }).limit(6).select('name email role status createdAt').lean(),
    Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
  ]);

  const totalRevenue = (revenue[0] as { total: number } | undefined)?.total ?? 0;

  const stats = [
    { label: 'Total Users',    value: totalUsers,    icon: Users,      color: 'from-blue-900   border-blue-700/40',   href: '/admin/users'  },
    { label: 'Total Stores',   value: totalStores,   icon: StoreIcon,  color: 'from-green-900  border-green-700/40',  href: '/admin/stores' },
    { label: 'Total Products', value: totalProducts, icon: Package,    color: 'from-purple-900 border-purple-700/40', href: '/admin/stores' },
    { label: 'Total Orders',   value: totalOrders,   icon: ShoppingBag,color: 'from-orange-900 border-orange-700/40', href: '/admin/orders' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Admin Overview</h1>
        <p className="text-gray-500 text-sm mt-1">OBM Pakistan — platform statistics</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href}
              className={`bg-gradient-to-br ${s.color} to-slate-900 border rounded-2xl p-5 hover:opacity-90 transition`}>
              <Icon className="w-5 h-5 text-gray-400 mb-3" />
              <div className="text-3xl font-black text-white">{s.value.toLocaleString()}</div>
              <div className="text-gray-400 text-sm mt-1">{s.label}</div>
            </Link>
          );
        })}
      </div>

      {/* Revenue */}
      <div className="bg-gradient-to-br from-green-900/40 to-slate-900 border border-green-700/40 rounded-2xl p-6 flex items-center gap-4">
        <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center shrink-0">
          <TrendingUp className="w-6 h-6 text-green-400" />
        </div>
        <div>
          <div className="text-3xl font-black text-white">Rs {totalRevenue.toLocaleString()}</div>
          <div className="text-gray-400 text-sm">Total Revenue (all stores combined)</div>
        </div>
      </div>

      {/* Recent Users */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-white">Recent Signups</h2>
          <Link href="/admin/users" className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300 transition font-semibold">
            All Users <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-2">
          {(recentUsers as Array<{ _id: unknown; name: string; email: string; role: string; status: string; createdAt: Date }>).map(u => (
            <div key={String(u._id)}
              className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
              <div>
                <p className="text-white font-semibold text-sm">{u.name}</p>
                <p className="text-gray-500 text-xs">{u.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                  ${u.role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  {u.role}
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                  ${u.status === 'approved' ? 'bg-green-500/20 text-green-400'
                    : u.status === 'blocked'  ? 'bg-red-500/20 text-red-400'
                    : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {u.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
