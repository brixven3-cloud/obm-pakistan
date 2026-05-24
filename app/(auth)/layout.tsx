import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Top bar */}
      <header className="border-b border-white/10 px-4 h-14 flex items-center">
        <Link href="/" className="flex items-center gap-1.5 select-none">
          <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-green-700 text-white font-black text-base leading-none">O</span>
          <span className="flex items-center gap-1">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg border-2 border-indigo-500/70 bg-gradient-to-br from-indigo-900 to-slate-900 text-indigo-200 font-black text-sm">B</span>
            <span className="flex items-center justify-center w-7 h-7 rounded-lg border-2 border-rose-500/70 bg-gradient-to-br from-rose-900 to-slate-900 text-rose-200 font-black text-sm">M</span>
            <span className="text-green-400 font-extrabold text-sm ml-1">Pakistan</span>
          </span>
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>

      <footer className="text-center text-xs text-gray-600 py-4">
        &copy; {new Date().getFullYear()} OBM Pakistan
      </footer>
    </div>
  );
}
