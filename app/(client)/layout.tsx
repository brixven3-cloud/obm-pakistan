import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-1.5 select-none">
            <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-green-700 text-white font-black text-base">O</span>
            <span className="flex items-center gap-1">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg border-2 border-indigo-500/70 bg-gradient-to-br from-indigo-900 to-slate-900 text-indigo-200 font-black text-sm">B</span>
              <span className="flex items-center justify-center w-7 h-7 rounded-lg border-2 border-rose-500/70 bg-gradient-to-br from-rose-900 to-slate-900 text-rose-200 font-black text-sm">M</span>
              <span className="text-green-400 font-extrabold text-sm ml-1">Pakistan</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400 hidden sm:block">{session.user.name}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {children}
      </main>
    </div>
  );
}
