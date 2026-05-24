import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Store from '@/lib/models/Store';
import Product from '@/lib/models/Product';
import Order from '@/lib/models/Order';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import CopyLinkButton from '@/components/CopyLinkButton';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  await connectDB();

  const store = await Store.findOne({ ownerId: session?.user.id }).lean() as { _id: unknown; slug: string; name: string; isActive: boolean } | null;

  const storeId = store?._id as string | undefined;
  const [productCount, orderCount] = storeId
    ? await Promise.all([
        Product.countDocuments({ storeId }),
        Order.countDocuments({ storeId }),
      ])
    : [0, 0];

  const storeUrl = store ? `/store/${store.slug}` : '';

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Assalam o Alaikum, {session?.user.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 mt-1 text-sm">OBM Pakistan Dashboard</p>
      </div>

      {/* No store yet */}
      {!store && (
        <div className="bg-gradient-to-br from-green-900/30 to-slate-900 border border-green-500/20 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-4">🚀</div>
          <h2 className="text-xl font-black text-white mb-2">Apna Store Banayein</h2>
          <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
            Sirf 3 steps mein apna online store ready ho jaayega!
          </p>
          <Link href="/store-builder"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-black px-8 py-3 rounded-xl transition">
            Store Banana Shuru Karein →
          </Link>
        </div>
      )}

      {/* Store exists */}
      {store && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Products',   value: productCount, color: 'from-green-900  border-green-700/40',  href: '/dashboard/products'   },
              { label: 'Orders',     value: orderCount,   color: 'from-indigo-900 border-indigo-700/40', href: '/dashboard/orders'     },
              { label: 'Categories', value: '—',          color: 'from-rose-900   border-rose-700/40',   href: '/dashboard/categories' },
            ].map(s => (
              <Link key={s.label} href={s.href}
                className={`bg-gradient-to-br ${s.color} to-slate-900 border rounded-2xl p-6 hover:opacity-90 transition`}>
                <div className="text-3xl font-black text-white">{s.value}</div>
                <div className="text-gray-400 text-sm mt-1">{s.label}</div>
              </Link>
            ))}
          </div>

          {/* Store link card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest mb-1">Aapka Store Link</p>
                <p className="text-white font-semibold text-sm truncate">{store.name}</p>
                <p className="text-green-400 text-xs mt-0.5 truncate">/store/{store.slug}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${store.isActive ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'}`}>
                  {store.isActive ? 'Live' : 'Paused'}
                </span>
                {/* Copy link */}
                <CopyLinkButton url={storeUrl} />
                {/* Open in new tab */}
                <Link href={`/store/${store.slug}`} target="_blank"
                  className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition"
                  title="Store kholen">
                  <ExternalLink className="w-4 h-4 text-gray-300" />
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Store Settings', href: store ? '/dashboard/store'    : '/store-builder', icon: '🏪' },
          { label: 'Products',       href: '/dashboard/products',   icon: '📦' },
          { label: 'Categories',     href: '/dashboard/categories',  icon: '🏷️' },
          { label: 'Orders',         href: '/dashboard/orders',      icon: '🧾' },
        ].map(l => (
          <Link key={l.label} href={l.href}
            className="bg-white/5 border border-white/10 hover:border-green-500/30 hover:bg-white/8 rounded-xl p-4 flex flex-col items-center gap-2 transition">
            <span className="text-2xl">{l.icon}</span>
            <span className="text-xs font-semibold text-gray-400 text-center">{l.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
