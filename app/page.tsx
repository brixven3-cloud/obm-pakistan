import Link from 'next/link';
import {
  Store, Share2, MessageCircle, Palette, Package, ShieldCheck,
  Smartphone, Building2, Laptop, Shirt, Sparkles, ShoppingBag,
  Check,
} from 'lucide-react';

const features = [
  { icon: Store,         title: 'Your Own Mini Store',  desc: 'Professional store in minutes — no coding needed.' },
  { icon: Share2,        title: 'Share Anywhere',        desc: 'WhatsApp, Instagram, Facebook — one link does it all.' },
  { icon: MessageCircle, title: 'Orders on WhatsApp',    desc: 'Every order arrives in your WhatsApp with full details.' },
  { icon: Palette,       title: '6 Beautiful Themes',    desc: 'Pick a colour theme that matches your brand instantly.' },
  { icon: Package,       title: 'Unlimited Products',    desc: 'Add as many products as you need with photos & prices.' },
  { icon: ShieldCheck,   title: 'Data Always Safe',      desc: 'Your store is never deleted — link paused, data preserved.' },
];

const businessTypes = [
  { label: 'Mobile Phones', icon: Smartphone  },
  { label: 'Property',      icon: Building2   },
  { label: 'Laptops',       icon: Laptop      },
  { label: 'Clothing',      icon: Shirt       },
  { label: 'Perfumes',      icon: Sparkles    },
  { label: 'Everything',    icon: ShoppingBag },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">

      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">

          <Link href="/" className="flex items-center gap-2 select-none">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-green-700 shadow-lg shadow-green-700/40 text-white font-black text-lg leading-none">
              O
            </span>
            <span className="flex items-center gap-1">
              {/* B — deep indigo/purple */}
              <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 border border-indigo-500/60 text-indigo-200 font-black text-lg leading-none shadow-[0_0_12px_2px_rgba(99,102,241,0.4)]">B</span>
              {/* M — deep crimson/rose */}
              <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-rose-900 via-red-900 to-slate-900 border border-rose-500/60 text-rose-200 font-black text-lg leading-none shadow-[0_0_12px_2px_rgba(244,63,94,0.4)]">M</span>
              <span className="text-green-400 font-extrabold text-base ml-1 tracking-wide"> Pakistan</span>
            </span>
          </Link>

          <nav className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-sm text-gray-400 hover:text-white font-medium px-3 py-1.5 rounded-lg hover:bg-white/10 transition"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="text-sm bg-white text-black font-bold px-4 py-2 rounded-lg hover:bg-gray-200 transition"
            >
              Rs 1000 Mein Shuru
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-green-600/25 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-4xl mx-auto px-4 py-20 sm:py-32 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-green-500 via-green-600 to-green-800 flex items-center justify-center shadow-2xl shadow-green-700/50">
                <span className="text-white font-black text-5xl sm:text-6xl leading-none select-none"
                  style={{ fontFamily: 'Arial Black, sans-serif' }}>
                  O
                </span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black leading-[1.05] tracking-tight mb-5 text-balance">
              Sell Online.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
                Get Paid on WhatsApp.
              </span>
            </h1>
            <p className="text-gray-400 text-base sm:text-xl max-w-2xl mx-auto mb-8 text-balance leading-relaxed">
              Build your Pakistani online store in minutes. Share one link anywhere.
              Orders arrive straight to your WhatsApp — no tech skills required.
            </p>
            <div className="flex flex-col xs:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="bg-white text-black font-bold px-8 py-3.5 rounded-xl text-base hover:bg-gray-200 transition shadow-lg"
              >
                Sirf Rs 1000 Mein Shuru Karein
              </Link>
              <Link
                href="/store/demo"
                className="border border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl text-base hover:bg-white/10 transition"
              >
                See Live Demo
              </Link>
            </div>
            <p className="mt-4 text-gray-600 text-sm">
              Sirf Rs 1000/month &bull; Store live in 5 minutes &bull; Pakistan&apos;s #1 store builder
            </p>
          </div>
        </section>

        {/* ── Business types ── */}
        <section className="border-y border-white/10 py-10 sm:py-14 bg-white/[0.02]">
          <div className="max-w-5xl mx-auto px-4">
            <p className="text-center text-xs font-semibold text-gray-500 uppercase tracking-widest mb-6">
              Built for every type of business
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {businessTypes.map((b) => {
                const Icon = b.icon;
                return (
                  <div
                    key={b.label}
                    className="flex flex-col items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-green-500/40 transition group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-green-600/20 border border-green-500/20 flex items-center justify-center group-hover:bg-green-600/30 transition">
                      <Icon className="w-5 h-5 text-green-400" strokeWidth={1.5} />
                    </div>
                    <span className="text-xs font-medium text-gray-400 text-center leading-tight group-hover:text-gray-200 transition">
                      {b.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="py-16 sm:py-24">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-4xl font-black text-white mb-3">
                Everything you need to sell online
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Sirf Rs 1000 per month. Build, launch, and grow from your phone.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-green-500/30 hover:bg-white/[0.07] transition group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-green-600/20 border border-green-500/20 flex items-center justify-center mb-4 group-hover:bg-green-600/30 transition">
                      <Icon className="w-5 h-5 text-green-400" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-bold text-white mb-1.5">{f.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section className="py-16 sm:py-20 border-t border-white/10">
          <div className="max-w-sm mx-auto px-4 text-center">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Qeemat</p>
            <div className="bg-white/5 border border-green-500/40 rounded-3xl p-8 shadow-xl shadow-green-900/20">
              <div className="flex items-end justify-center gap-1 mb-2">
                <span className="text-gray-400 text-lg font-bold mb-2">Rs</span>
                <span className="text-7xl font-black text-white leading-none">1000</span>
                <span className="text-gray-400 text-lg font-bold mb-2">/month</span>
              </div>
              <p className="text-gray-400 text-sm mb-6">Ek mahine ka kharcha — ek chai ki qeemat</p>
              <ul className="text-left space-y-3 mb-8">
                {[
                  'Apna online store',
                  'Unlimited products',
                  'WhatsApp par orders',
                  '6 themes — change karo kabhi bhi',
                  'Data hamesha safe',
                  'Mobile + Desktop — dono par',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-300">
                    <span className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block w-full bg-green-600 hover:bg-green-700 text-white font-black py-3.5 rounded-xl transition text-base"
              >
                Abhi Shuru Karein — Rs 1000
              </Link>
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="border-t border-white/10 py-16 sm:py-24 bg-white/[0.02]">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-4xl font-black text-white mb-12">
              Up and running in 3 steps
            </h2>
            <div className="flex flex-col sm:flex-row gap-8 sm:gap-4 items-center sm:items-start">
              {[
                { step: '1', title: 'Sign Up',          desc: 'Sirf Rs 1000 mein account banayein — 1 minute lagta hai.' },
                { step: '2', title: 'Build Your Store', desc: 'Add products, pick a theme, set your WhatsApp.' },
                { step: '3', title: 'Share & Sell',     desc: 'Post your link anywhere. Orders hit your WhatsApp.' },
              ].map((s, i) => (
                <div key={s.step} className="flex-1 flex flex-col items-center gap-3 relative">
                  {i < 2 && (
                    <div className="hidden sm:block absolute top-5 left-[calc(50%+28px)] right-0 h-px bg-gradient-to-r from-green-700/60 to-transparent" />
                  )}
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-green-500 to-green-700 text-white text-lg font-black flex items-center justify-center shadow-lg shadow-green-700/30 z-10">
                    {s.step}
                  </div>
                  <h3 className="font-bold text-white">{s.title}</h3>
                  <p className="text-sm text-gray-500 text-balance">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-16 sm:py-24">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-4xl font-black text-white mb-4">
              Ready to launch your store?
            </h2>
            <p className="text-gray-500 mb-8">
              Sirf Rs 1000/month mein hazaron Pakistani businesses ki tarah online becho.
            </p>
            <Link
              href="/register"
              className="inline-block bg-white text-black font-black px-10 py-4 rounded-xl text-lg hover:bg-gray-200 transition shadow-2xl"
            >
              Sirf Rs 1000 Mein Apna Store Shuru Karein
            </Link>
          </div>
        </section>
      </main>

      {/* ── Floating Brixven 3D Cube ── */}
      <a
        href="https://brixven.com"
        target="_blank"
        rel="noopener noreferrer"
        className="animate-float fixed bottom-6 right-4 z-50 w-28 hover:scale-110 transition-transform"
        title="Powered by Brixven"
      >
        <svg viewBox="0 0 100 108" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-2xl">
          <defs>
            <filter id="cs" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="1" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.9"/>
            </filter>
          </defs>

          <g filter="url(#cs)">
            {/* ── TOP FACE ── */}
            <polygon points="50,8 64,15 50,22 36,15"   fill="#4ade80" stroke="#052e16" strokeWidth="0.7"/>
            <polygon points="64,15 78,22 64,29 50,22"  fill="#86efac" stroke="#052e16" strokeWidth="0.7"/>
            <polygon points="78,22 92,29 78,36 64,29"  fill="#4ade80" stroke="#052e16" strokeWidth="0.7"/>
            <polygon points="36,15 50,22 36,29 22,22"  fill="#22c55e" stroke="#052e16" strokeWidth="0.7"/>
            <polygon points="50,22 64,29 50,36 36,29"  fill="#4ade80" stroke="#052e16" strokeWidth="0.7"/>
            <polygon points="64,29 78,36 64,43 50,36"  fill="#86efac" stroke="#052e16" strokeWidth="0.7"/>
            <polygon points="22,22 36,29 22,36 8,29"   fill="#22c55e" stroke="#052e16" strokeWidth="0.7"/>
            <polygon points="36,29 50,36 36,43 22,36"  fill="#4ade80" stroke="#052e16" strokeWidth="0.7"/>
            <polygon points="50,36 64,43 50,50 36,43"  fill="#22c55e" stroke="#052e16" strokeWidth="0.7"/>

            {/* ── LEFT FACE ── */}
            <polygon points="8,29 22,36 22,50 8,43"    fill="#15803d" stroke="#052e16" strokeWidth="0.7"/>
            <polygon points="22,36 36,43 36,57 22,50"  fill="#166534" stroke="#052e16" strokeWidth="0.7"/>
            <polygon points="36,43 50,50 50,64 36,57"  fill="#14532d" stroke="#052e16" strokeWidth="0.7"/>
            <polygon points="8,43 22,50 22,64 8,57"    fill="#166534" stroke="#052e16" strokeWidth="0.7"/>
            <polygon points="22,50 36,57 36,71 22,64"  fill="#14532d" stroke="#052e16" strokeWidth="0.7"/>
            <polygon points="36,57 50,64 50,78 36,71"  fill="#15803d" stroke="#052e16" strokeWidth="0.7"/>
            <polygon points="8,57 22,64 22,78 8,71"    fill="#14532d" stroke="#052e16" strokeWidth="0.7"/>
            <polygon points="22,64 36,71 36,85 22,78"  fill="#166534" stroke="#052e16" strokeWidth="0.7"/>
            <polygon points="36,71 50,78 50,92 36,85"  fill="#15803d" stroke="#052e16" strokeWidth="0.7"/>

            {/* ── RIGHT FACE ── */}
            <polygon points="50,50 64,43 64,57 50,64"  fill="#16a34a" stroke="#052e16" strokeWidth="0.7"/>
            <polygon points="64,43 78,36 78,50 64,57"  fill="#15803d" stroke="#052e16" strokeWidth="0.7"/>
            <polygon points="78,36 92,29 92,43 78,50"  fill="#16a34a" stroke="#052e16" strokeWidth="0.7"/>
            <polygon points="50,64 64,57 64,71 50,78"  fill="#15803d" stroke="#052e16" strokeWidth="0.7"/>
            <polygon points="64,57 78,50 78,64 64,71"  fill="#16a34a" stroke="#052e16" strokeWidth="0.7"/>
            <polygon points="78,50 92,43 92,57 78,64"  fill="#15803d" stroke="#052e16" strokeWidth="0.7"/>
            <polygon points="50,78 64,71 64,85 50,92"  fill="#16a34a" stroke="#052e16" strokeWidth="0.7"/>
            <polygon points="64,71 78,64 78,78 64,85"  fill="#15803d" stroke="#052e16" strokeWidth="0.7"/>
            <polygon points="78,64 92,57 92,71 78,78"  fill="#16a34a" stroke="#052e16" strokeWidth="0.7"/>
          </g>

          {/* ── Label ── */}
          <text
            x="50" y="104"
            textAnchor="middle"
            fill="white"
            fontWeight="900"
            fontSize="10"
            fontFamily="Arial Black, Arial, sans-serif"
            letterSpacing="1"
          >
            BRIXVEN
          </text>
        </svg>
      </a>

      {/* ── Footer ── */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-green-500 to-green-700 text-white font-black text-sm">
              O
            </span>
            <span className="font-bold text-gray-400">BM Pakistan</span>
          </div>

          <span>&copy; {new Date().getFullYear()} OBM Pakistan. All rights reserved.</span>

          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-gray-300 transition">Privacy</Link>
            <Link href="/terms"   className="hover:text-gray-300 transition">Terms</Link>
            <span className="text-gray-700">|</span>
            <a
              href="https://brixven.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-green-400 transition font-medium"
            >
              Powered by <span className="text-green-500 font-bold">Brixven.com</span>
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
