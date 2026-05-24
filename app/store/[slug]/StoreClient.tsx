'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { ShoppingCart, Plus, Minus, X, Package, MessageCircle, Search } from 'lucide-react';

interface Category { _id: string; name: string }
interface Product  { _id: string; title: string; description?: string; price: number; images: string[]; inStock: boolean; categoryId?: string }
interface StoreData {
  _id: string;
  name: string;
  tagline?: string;
  whatsappNumber: string;
  theme: string;
  sections: {
    header: { announcement?: string };
    hero:   { headline: string; subheadline?: string };
    about:  { title?: string; body?: string };
  };
}
interface CartItem { product: Product; qty: number }

export default function StoreClient({ store, products, categories, theme }: {
  store: StoreData;
  products: Product[];
  categories: Category[];
  theme: { bg: string; dark: string };
}) {
  const [cart,      setCart]      = useState<CartItem[]>([]);
  const [cartOpen,  setCartOpen]  = useState(false);
  const [activeCat, setActiveCat] = useState('');
  const [search,    setSearch]    = useState('');
  const [form,      setForm]      = useState({ name: '', phone: '', address: '' });
  const [placing,   setPlacing]   = useState(false);
  const [success,   setSuccess]   = useState(false);
  const [error,     setError]     = useState('');

  const t = theme;

  const filtered = useMemo(() => {
    let list = products;
    if (activeCat) list = list.filter(p => p.categoryId === activeCat);
    if (search)    list = list.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [products, activeCat, search]);

  function addToCart(product: Product) {
    setCart(c => {
      const found = c.find(i => i.product._id === product._id);
      if (found) return c.map(i => i.product._id === product._id ? { ...i, qty: i.qty + 1 } : i);
      return [...c, { product, qty: 1 }];
    });
    setCartOpen(true);
  }

  function updateQty(id: string, delta: number) {
    setCart(c => c.map(i => i.product._id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  }

  function removeFromCart(id: string) {
    setCart(c => c.filter(i => i.product._id !== id));
  }

  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  async function placeOrder() {
    if (!form.name.trim())    { setError('Apna naam likhein');    return; }
    if (!form.phone.trim())   { setError('Phone number likhein'); return; }
    if (!form.address.trim()) { setError('Address likhein');      return; }

    setPlacing(true); setError('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId:  store._id,
          customer: form,
          items:    cart.map(i => ({ productId: i.product._id, title: i.product.title, price: i.product.price, qty: i.qty })),
          total:    cartTotal,
        }),
      });
      if (!res.ok) throw new Error();

      // WhatsApp message
      const num      = store.whatsappNumber.replace('+', '');
      const itemsTxt = cart.map(i => `- ${i.product.title} ×${i.qty} = Rs ${(i.product.price * i.qty).toLocaleString()}`).join('\n');
      const msg = encodeURIComponent(
        `🛍️ *New Order — ${store.name}*\n\n📦 *Items:*\n${itemsTxt}\n\n💰 *Total: Rs ${cartTotal.toLocaleString()}*\n\n👤 *Customer Info:*\nNaam: ${form.name}\nPhone: ${form.phone}\nAddress: ${form.address}\n\n_Via OBM Pakistan_`
      );
      window.open(`https://wa.me/${num}?text=${msg}`, '_blank');

      setSuccess(true);
      setCart([]);
    } catch {
      setError('Order nahi hua. Dobara try karein.');
    }
    setPlacing(false);
  }

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Announcement bar */}
      {store.sections.header.announcement && (
        <div className="text-center text-xs sm:text-sm py-2 px-4 font-semibold text-white"
          style={{ background: t.dark }}>
          {store.sections.header.announcement}
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/95 backdrop-blur border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-black text-white text-base sm:text-lg leading-none truncate">{store.name}</h1>
            {store.tagline && <p className="text-xs text-gray-500 mt-0.5 truncate">{store.tagline}</p>}
          </div>
          <button onClick={() => setCartOpen(true)}
            className="relative w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition hover:opacity-90"
            style={{ background: t.bg }}>
            <ShoppingCart className="w-5 h-5 text-white" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white rounded-full text-[10px] font-black flex items-center justify-center"
                style={{ color: t.bg }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="py-10 sm:py-20 text-center px-4"
        style={{ background: `linear-gradient(160deg, ${t.dark}80 0%, #000 60%)` }}>
        <h2 className="text-2xl sm:text-5xl font-black text-white mb-2 sm:mb-3">
          {store.sections.hero.headline}
        </h2>
        {store.sections.hero.subheadline && (
          <p className="text-gray-400 text-sm sm:text-lg max-w-xl mx-auto">
            {store.sections.hero.subheadline}
          </p>
        )}
      </section>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8">

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Products search karein..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none transition" />
        </div>

        {/* Category tabs */}
        {categories.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-5">
            <button onClick={() => setActiveCat('')}
              className="px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition border"
              style={!activeCat ? { background: t.bg, borderColor: t.bg, color: '#fff' } : { background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: '#9ca3af' }}>
              All
            </button>
            {categories.map(c => (
              <button key={c._id} onClick={() => setActiveCat(activeCat === c._id ? '' : c._id)}
                className="px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition border"
                style={activeCat === c._id ? { background: t.bg, borderColor: t.bg, color: '#fff' } : { background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: '#9ca3af' }}>
                {c.name}
              </button>
            ))}
          </div>
        )}

        {/* Products */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 font-semibold">Koi product nahi mila</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filtered.map(p => (
              <div key={p._id}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition flex flex-col">
                <div className="relative h-36 sm:h-44 bg-white/5 shrink-0">
                  {p.images[0] ? (
                    <Image src={p.images[0]} alt={p.title} fill className="object-cover" sizes="(max-width:640px) 50vw, 25vw" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-600" />
                    </div>
                  )}
                  {!p.inStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-xs font-bold text-red-400 bg-red-500/20 border border-red-500/30 px-2 py-0.5 rounded-full">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-3 flex flex-col flex-1">
                  <p className="text-white text-sm font-semibold line-clamp-2 leading-snug">{p.title}</p>
                  {p.description && (
                    <p className="text-gray-500 text-xs mt-1 line-clamp-2 leading-relaxed">{p.description}</p>
                  )}
                  <p className="font-black text-sm mt-1.5" style={{ color: t.bg }}>
                    Rs {p.price.toLocaleString()}
                  </p>
                  <button onClick={() => p.inStock && addToCart(p)} disabled={!p.inStock}
                    className="mt-auto w-full py-2 rounded-xl text-white font-bold text-xs transition mt-2 disabled:opacity-40"
                    style={{ background: p.inStock ? t.bg : '#374151' }}>
                    {p.inStock ? '+ Cart mein add karein' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* About */}
        {store.sections.about?.body && (
          <section className="mt-10 sm:mt-14 border-t border-white/10 pt-6 sm:pt-8">
            <h3 className="text-lg sm:text-xl font-black text-white mb-2">
              {store.sections.about.title || 'About Us'}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">{store.sections.about.body}</p>
          </section>
        )}

        {/* WhatsApp contact */}
        <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold text-sm">Koi sawal hai?</p>
            <p className="text-gray-500 text-xs mt-0.5">WhatsApp par seedha baat karein</p>
          </div>
          <a href={`https://wa.me/${store.whatsappNumber.replace('+', '')}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-white font-bold text-xs sm:text-sm px-3 sm:px-4 py-2.5 rounded-xl transition shrink-0"
            style={{ background: t.bg }}>
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-5 mt-10 text-center text-xs text-gray-700">
        Powered by{' '}
        <a href="/" className="text-gray-500 hover:text-gray-300 font-semibold transition">OBM Pakistan</a>
      </footer>

      {/* ── Cart Drawer ── */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { if (!placing) { setCartOpen(false); if (success) setSuccess(false); } }} />
          <div className="relative w-full max-w-sm bg-gray-950 border-l border-white/10 flex flex-col h-full shadow-2xl">

            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
              <h2 className="font-black text-white text-lg">
                {success ? '✅ Order Ho Gaya!' : `Cart (${cartCount} items)`}
              </h2>
              <button onClick={() => { setCartOpen(false); if (success) setSuccess(false); }}
                className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition">
                <X className="w-4 h-4 text-gray-300" />
              </button>
            </div>

            {/* Success state */}
            {success ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-black text-white mb-2">Shukriya!</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                  Aapka order store owner ko WhatsApp par bhej diya gaya. Woh jald contact karenge.
                </p>
                <button onClick={() => { setSuccess(false); setCartOpen(false); }}
                  className="mt-6 px-6 py-3 rounded-xl text-white font-bold text-sm transition"
                  style={{ background: t.bg }}>
                  Aur Shopping Karein
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <ShoppingCart className="w-12 h-12 text-gray-700 mb-3" />
                <p className="text-gray-500 font-semibold">Cart khali hai</p>
                <p className="text-gray-600 text-sm mt-1">Koi product add karein</p>
                <button onClick={() => setCartOpen(false)}
                  className="mt-4 text-sm font-semibold px-5 py-2 rounded-xl transition"
                  style={{ background: t.bg, color: '#fff' }}>
                  Products Dekh
                </button>
              </div>
            ) : (
              <>
                {/* Items list */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {cart.map(item => (
                    <div key={item.product._id} className="flex gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-white/5 shrink-0">
                        {item.product.images[0]
                          ? <Image src={item.product.images[0]} alt={item.product.title} fill className="object-cover" sizes="56px" />
                          : <Package className="w-5 h-5 text-gray-600 absolute inset-0 m-auto" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-semibold line-clamp-2">{item.product.title}</p>
                        <p className="text-xs font-black mt-0.5" style={{ color: t.bg }}>
                          Rs {(item.product.price * item.qty).toLocaleString()}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <button onClick={() => updateQty(item.product._id, -1)}
                            className="w-6 h-6 bg-white/10 hover:bg-white/20 rounded-md flex items-center justify-center transition">
                            <Minus className="w-2.5 h-2.5 text-white" />
                          </button>
                          <span className="text-white text-xs font-bold w-5 text-center">{item.qty}</span>
                          <button onClick={() => updateQty(item.product._id, 1)}
                            className="w-6 h-6 bg-white/10 hover:bg-white/20 rounded-md flex items-center justify-center transition">
                            <Plus className="w-2.5 h-2.5 text-white" />
                          </button>
                          <button onClick={() => removeFromCart(item.product._id)}
                            className="ml-auto w-6 h-6 bg-red-500/20 hover:bg-red-500/40 rounded-md flex items-center justify-center transition">
                            <X className="w-2.5 h-2.5 text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order form + checkout */}
                <div className="border-t border-white/10 p-4 space-y-3 shrink-0">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm font-semibold">Total</span>
                    <span className="text-white font-black text-xl">Rs {cartTotal.toLocaleString()}</span>
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl px-3 py-2">
                      {error}
                    </div>
                  )}

                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Aapka naam *"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none transition" />
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="Phone number * (+92...)"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none transition" />
                  <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    placeholder="Delivery address *"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none transition" />

                  <button onClick={placeOrder} disabled={placing}
                    className="w-full py-3 rounded-xl text-white font-black text-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ background: t.bg }}>
                    {placing
                      ? 'Order ho raha hai...'
                      : <><MessageCircle className="w-4 h-4" /> WhatsApp par Order Karein</>}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
