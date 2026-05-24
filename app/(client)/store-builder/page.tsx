'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Smartphone, Building2, Laptop, Shirt, Sparkles, ShoppingBag,
  ChevronRight, ChevronLeft, Check, Store,
} from 'lucide-react';

const BUSINESS_TYPES = [
  { value: 'mobile',   label: 'Mobile Phones', icon: Smartphone  },
  { value: 'property', label: 'Property',       icon: Building2   },
  { value: 'laptop',   label: 'Laptops',        icon: Laptop      },
  { value: 'cloth',    label: 'Clothing',       icon: Shirt       },
  { value: 'perfume',  label: 'Perfumes',       icon: Sparkles    },
  { value: 'other',    label: 'Everything',     icon: ShoppingBag },
];

const THEMES = [
  { value: 'green',    label: 'Green',     bg: '#16a34a', dark: '#14532d' },
  { value: 'blue',     label: 'Blue',      bg: '#2563eb', dark: '#1e3a8a' },
  { value: 'darkGold', label: 'Dark Gold', bg: '#b45309', dark: '#78350f' },
  { value: 'pink',     label: 'Pink',      bg: '#db2777', dark: '#9d174d' },
  { value: 'teal',     label: 'Teal',      bg: '#0d9488', dark: '#134e4a' },
  { value: 'coral',    label: 'Coral',     bg: '#e11d48', dark: '#881337' },
];

const STEPS = ['Business', 'Store Info', 'Theme', 'Done'];

function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 40);
}

export default function StoreBuilderPage() {
  const router = useRouter();
  const [step, setStep]     = useState(0);
  const [error, setError]   = useState('');
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    businessType:   '',
    name:           '',
    tagline:        '',
    slug:           '',
    whatsappNumber: '+92',
    theme:          'green',
    hero:           { headline: 'Welcome to our store', subheadline: '' },
    about:          { title: 'About Us', body: '' },
    announcement:   '',
  });

  // Check if store already exists
  useEffect(() => {
    fetch('/api/store').then(r => r.json()).then(d => {
      if (d.store) router.push('/dashboard');
    });
  }, [router]);

  const set = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  async function handleCreate() {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessType:   form.businessType,
          name:           form.name,
          tagline:        form.tagline,
          slug:           form.slug,
          whatsappNumber: form.whatsappNumber,
          theme:          form.theme,
          sections: {
            header: { announcement: form.announcement },
            hero:   form.hero,
            about:  form.about,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setSaving(false); return; }
      setStep(3);
    } catch {
      setError('Server error. Try again.');
      setSaving(false);
    }
  }

  function nextStep() {
    setError('');
    if (step === 0 && !form.businessType) { setError('Business type choose karein'); return; }
    if (step === 1) {
      if (!form.name.trim())            { setError('Store name zaroor likhein'); return; }
      if (!form.slug.trim())            { setError('Store URL zaroor likhein'); return; }
      if (!/^\+92\d{10}$/.test(form.whatsappNumber)) { setError('WhatsApp: +92300xxxxxxx format'); return; }
    }
    if (step === 2) { handleCreate(); return; }
    setStep(s => s + 1);
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition
              ${i < step ? 'bg-green-600 text-white' : i === step ? 'bg-green-600 text-white ring-4 ring-green-600/20' : 'bg-white/10 text-gray-500'}`}>
              {i < step ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-xs font-semibold hidden sm:block ${i === step ? 'text-white' : 'text-gray-500'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i < step ? 'bg-green-600' : 'bg-white/10'}`} />}
          </div>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">

        {/* ── Step 0: Business Type ── */}
        {step === 0 && (
          <div>
            <h2 className="text-2xl font-black text-white mb-1">Apna business type chunein</h2>
            <p className="text-gray-500 text-sm mb-6">Aapka store kis cheez ka hai?</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {BUSINESS_TYPES.map(b => {
                const Icon = b.icon;
                const sel  = form.businessType === b.value;
                return (
                  <button key={b.value} onClick={() => set('businessType', b.value)}
                    className={`flex flex-col items-center gap-3 p-5 rounded-xl border transition
                      ${sel ? 'border-green-500 bg-green-600/20 text-white' : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-white'}`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${sel ? 'bg-green-600' : 'bg-white/10'}`}>
                      <Icon className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                    <span className="text-sm font-semibold">{b.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Step 1: Store Info ── */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-black text-white mb-1">Store ki details</h2>
            <p className="text-gray-500 text-sm mb-6">Ye info aapke store par show hogi</p>
            <div className="space-y-4">
              {[
                { label: 'Store Name *', field: 'name', placeholder: 'Ali Mobile Shop', type: 'text' },
                { label: 'Tagline', field: 'tagline', placeholder: 'Best phones in Lahore', type: 'text' },
              ].map(f => (
                <div key={f.field}>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">{f.label}</label>
                  <input type={f.type} value={form[f.field as 'name' | 'tagline']}
                    onChange={e => {
                      set(f.field, e.target.value);
                      if (f.field === 'name') set('slug', slugify(e.target.value));
                    }}
                    placeholder={f.placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/60 transition" />

                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Store URL * <span className="text-gray-600">obmpakistan.com/store/</span></label>
                <input type="text" value={form.slug}
                  onChange={e => set('slug', slugify(e.target.value))}
                  placeholder="ali-mobile-shop"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/60 transition" />
                {form.slug && <p className="text-xs text-green-400 mt-1">obmpakistan.com/store/{form.slug}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">WhatsApp Number * <span className="text-gray-600">(orders yahan aayenge)</span></label>
                <input type="tel" value={form.whatsappNumber}
                  onChange={e => set('whatsappNumber', e.target.value)}
                  placeholder="+92300xxxxxxx"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/60 transition" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Announcement (optional)</label>
                <input type="text" value={form.announcement}
                  onChange={e => set('announcement', e.target.value)}
                  placeholder="Free delivery on orders over Rs 2000"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/60 transition" />
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Theme ── */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-black text-white mb-1">Theme chunein</h2>
            <p className="text-gray-500 text-sm mb-6">Baad mein bhi change kar sakte hain</p>
            <div className="grid grid-cols-3 gap-3">
              {THEMES.map(t => {
                const sel = form.theme === t.value;
                return (
                  <button key={t.value} onClick={() => set('theme', t.value)}
                    className={`relative flex flex-col items-center gap-3 p-4 rounded-xl border transition
                      ${sel ? 'border-white bg-white/10' : 'border-white/10 hover:border-white/30'}`}>
                    <div className="w-12 h-12 rounded-full shadow-lg" style={{ background: `linear-gradient(135deg, ${t.bg}, ${t.dark})` }} />
                    <span className="text-xs font-semibold text-gray-300">{t.label}</span>
                    {sel && <Check className="absolute top-2 right-2 w-4 h-4 text-white" />}
                  </button>
                );
              })}
            </div>

            {/* Live preview */}
            <div className="mt-6 rounded-xl overflow-hidden border border-white/10">
              <div className="h-2" style={{ background: THEMES.find(t => t.value === form.theme)?.bg }} />
              <div className="bg-white/5 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-white text-sm">{form.name || 'My Store'}</span>
                  <div className="w-16 h-6 rounded-lg" style={{ background: THEMES.find(t => t.value === form.theme)?.bg }} />
                </div>
                <div className="h-16 rounded-lg flex items-center justify-center text-xs text-gray-500" style={{ background: `${THEMES.find(t => t.value === form.theme)?.bg}22` }}>
                  Hero Section Preview
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 3: Done ── */}
        {step === 3 && (
          <div className="text-center py-4">
            <div className="w-20 h-20 bg-green-600/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Store className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Store ban gaya!</h2>
            <p className="text-gray-400 text-sm mb-2">Aapka store live hai:</p>
            <a href={`/store/${form.slug}`} target="_blank"
              className="text-green-400 text-sm font-semibold hover:underline break-all">
              /store/{form.slug}
            </a>
            <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
              <button onClick={() => router.push('/dashboard/products')}
                className="bg-green-600 hover:bg-green-700 text-white font-black px-6 py-3 rounded-xl transition">
                Products Add Karein
              </button>
              <button onClick={() => router.push('/dashboard')}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl transition">
                Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Navigation */}
        {step < 3 && (
          <div className="flex justify-between mt-8">
            <button onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-white disabled:opacity-30 transition">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button onClick={nextStep} disabled={saving}
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-black px-6 py-2.5 rounded-xl transition text-sm">
              {saving ? 'Saving...' : step === 2 ? 'Store Banayein' : 'Next'}
              {!saving && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
