import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';

const stats = [
  { label: 'Orders',   value: '0', icon: '📦', color: 'from-green-900  to-slate-900 border-green-700/40'  },
  { label: 'Products', value: '0', icon: '🛍️', color: 'from-indigo-900 to-slate-900 border-indigo-700/40' },
  { label: 'Store',    value: '—', icon: '🏪', color: 'from-rose-900   to-slate-900 border-rose-700/40'   },
];

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Assalam o Alaikum, {session?.user.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 mt-1 text-sm">OBM Pakistan Dashboard mein khush aamdeed</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(s => (
          <div key={s.label} className={`bg-gradient-to-br ${s.color} border rounded-2xl p-6`}>
            <div className="text-3xl mb-2">{s.icon}</div>
            <div className="text-3xl font-black text-white">{s.value}</div>
            <div className="text-gray-400 text-sm mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Setup store CTA */}
      <div className="bg-white/5 border border-green-500/20 rounded-2xl p-8 text-center">
        <div className="text-4xl mb-4">🚀</div>
        <h2 className="text-xl font-black text-white mb-2">Apna Store Banayein</h2>
        <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
          Products add karein, theme choose karein, aur apna WhatsApp number set karein.
          Sirf 5 minute lagenge!
        </p>
        <Link
          href="/store-builder"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-black px-8 py-3 rounded-xl transition"
        >
          Store Banana Shuru Karein
        </Link>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'My Store',  href: '/dashboard/store',    icon: '🏪' },
          { label: 'Products',  href: '/dashboard/products', icon: '📦' },
          { label: 'Orders',    href: '/dashboard/orders',   icon: '🧾' },
          { label: 'Settings',  href: '/dashboard/settings', icon: '⚙️' },
        ].map(l => (
          <Link
            key={l.label}
            href={l.href}
            className="bg-white/5 border border-white/10 hover:border-green-500/30 hover:bg-white/8 rounded-xl p-4 flex flex-col items-center gap-2 transition"
          >
            <span className="text-2xl">{l.icon}</span>
            <span className="text-xs font-semibold text-gray-400">{l.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
