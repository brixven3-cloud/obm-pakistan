import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';
import { LayoutDashboard, Users, Store, ShoppingBag } from 'lucide-react';

const NAV = [
  { href: '/admin',         label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/users',   label: 'Users',    icon: Users            },
  { href: '/admin/stores',  label: 'Stores',   icon: Store            },
  { href: '/admin/orders',  label: 'Orders',   icon: ShoppingBag      },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') redirect('/dashboard');

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-2 select-none">
              <span className="flex items-center justify-center h-8 px-2 rounded-xl bg-gradient-to-br from-green-500 to-green-700 text-white font-black text-sm tracking-widest">
                OBM
              </span>
            </Link>
            <span className="text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full tracking-widest">
              SUPER ADMIN
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400 hidden sm:block">{session.user.name}</span>
            <Link href="/dashboard" className="text-xs text-gray-500 hover:text-white border border-white/10 px-3 py-1.5 rounded-lg transition">
              Client View
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        {/* Sidebar — desktop */}
        <aside className="w-52 shrink-0 border-r border-white/10 py-6 px-3 hidden md:block">
          <nav className="space-y-1">
            {NAV.map(n => {
              const Icon = n.icon;
              return (
                <Link key={n.href} href={n.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition">
                  <Icon className="w-4 h-4" />
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/95 border-t border-white/10 flex justify-around py-2">
          {NAV.map(n => {
            const Icon = n.icon;
            return (
              <Link key={n.href} href={n.href}
                className="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition p-2">
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-semibold">{n.label}</span>
              </Link>
            );
          })}
        </nav>

        <main className="flex-1 px-4 sm:px-6 py-8 pb-24 md:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
