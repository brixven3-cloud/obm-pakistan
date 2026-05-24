'use client';

import { useState, useEffect } from 'react';
import { Check, ExternalLink } from 'lucide-react';

const THEMES = [
  { value: 'green',    label: 'Green',     bg: '#16a34a', dark: '#14532d' },
  { value: 'blue',     label: 'Blue',      bg: '#2563eb', dark: '#1e3a8a' },
  { value: 'darkGold', label: 'Dark Gold', bg: '#b45309', dark: '#78350f' },
  { value: 'pink',     label: 'Pink',      bg: '#db2777', dark: '#9d174d' },
  { value: 'teal',     label: 'Teal',      bg: '#0d9488', dark: '#134e4a' },
  { value: 'coral',    label: 'Coral',     bg: '#e11d48', dark: '#881337' },
  { value: 'purple',   label: 'Purple',    bg: '#7c3aed', dark: '#4c1d95' },
  { value: 'orange',   label: 'Orange',    bg: '#ea580c', dark: '#7c2d12' },
  { value: 'rose',     label: 'Rose Gold', bg: '#be185d', dark: '#831843' },
  { value: 'slate',    label: 'Silver',    bg: '#475569', dark: '#1e293b' },
  { value: 'white',    label: 'White',     bg: '#f8fafc', dark: '#cbd5e1' },
  { value: 'black',    label: 'Black',     bg: '#18181b', dark: '#09090b' },
];

interface StoreForm {
  name: string; tagline: string; whatsappNumber: string; theme: string;
  announcement: string; heroHeadline: string; heroSubheadline: string;
  aboutTitle: string; aboutBody: string; isActive: boolean;
}

const EMPTY: StoreForm = {
  name: '', tagline: '', whatsappNumber: '+92', theme: 'green',
  announcement: '', heroHeadline: '', heroSubheadline: '',
  aboutTitle: '', aboutBody: '', isActive: true,
};

export default function StoreSettingsPage() {
  const [form,    setForm]    = useState<StoreForm>(EMPTY);
  const [slug,    setSlug]    = useState('');
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState('');

  useEffect(() => {
    fetch('/api/store').then(r => r.json()).then(d => {
      if (d.store) {
        const s = d.store;
        setSlug(s.slug);
        setForm({
          name:             s.name            ?? '',
          tagline:          s.tagline         ?? '',
          whatsappNumber:   s.whatsappNumber  ?? '+92',
          theme:            s.theme           ?? 'green',
          announcement:     s.sections?.header?.announcement ?? '',
          heroHeadline:     s.sections?.hero?.headline       ?? '',
          heroSubheadline:  s.sections?.hero?.subheadline    ?? '',
          aboutTitle:       s.sections?.about?.title         ?? '',
          aboutBody:        s.sections?.about?.body          ?? '',
          isActive:         s.isActive ?? true,
        });
      }
      setLoading(false);
    });
  }, []);

  const set = (field: keyof StoreForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  async function handleSave() {
    setSaving(true); setError(''); setSaved(false);
    const res = await fetch('/api/store', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:           form.name,
        tagline:        form.tagline,
        whatsappNumber: form.whatsappNumber,
        theme:          form.theme,
        isActive:       form.isActive,
        sections: {
          header: { announcement: form.announcement },
          hero:   { headline: form.heroHeadline, subheadline: form.heroSubheadline },
          about:  { title: form.aboutTitle,      body: form.aboutBody },
        },
      }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setSaving(false); return; }
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => <div key={i} className="bg-white/5 rounded-xl h-14 animate-pulse" />)}
    </div>
  );

  const currentTheme = THEMES.find(t => t.value === form.theme) ?? THEMES[0];

  return (
    <div className="max-w-2xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Store Settings</h1>
          <p className="text-gray-500 text-sm">Apne store ki details update karein</p>
        </div>
        {slug && (
          <a href={`/store/${slug}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-green-400 hover:text-green-300 transition font-semibold border border-green-500/30 px-3 py-1.5 rounded-lg">
            <ExternalLink className="w-3.5 h-3.5" /> Store Dekhein
          </a>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">{error}</div>
      )}
      {saved && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
          <Check className="w-4 h-4" /> Store update ho gaya!
        </div>
      )}

      {/* Basic Info */}
      <section className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
        <h2 className="font-black text-white text-sm uppercase tracking-widest text-gray-400">Basic Info</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Store Name *</label>
            <input value={form.name} onChange={set('name')} placeholder="Ali Mobile Shop"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/60 transition" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Tagline</label>
            <input value={form.tagline} onChange={set('tagline')} placeholder="Best phones in Lahore"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/60 transition" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5">WhatsApp Number *</label>
          <input value={form.whatsappNumber} onChange={set('whatsappNumber')} placeholder="+92300xxxxxxx"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/60 transition" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5">Announcement Bar</label>
          <input value={form.announcement} onChange={set('announcement')} placeholder="Free delivery on orders above Rs 2000"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/60 transition" />
        </div>

        {/* Store Active Toggle */}
        <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
          <div>
            <p className="text-sm text-white font-semibold">Store Status</p>
            <p className="text-xs text-gray-500 mt-0.5">{form.isActive ? 'Store live hai — customers dekh sakte hain' : 'Store paused hai — koi nahi dekh sakta'}</p>
          </div>
          <button onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
            className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${form.isActive ? 'bg-green-600' : 'bg-white/20'}`}>
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${form.isActive ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
      </section>

      {/* Hero Section */}
      <section className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
        <h2 className="font-black text-white text-sm uppercase tracking-widest text-gray-400">Hero Section</h2>
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5">Headline *</label>
          <input value={form.heroHeadline} onChange={set('heroHeadline')} placeholder="Welcome to our store"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/60 transition" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5">Sub-headline</label>
          <input value={form.heroSubheadline} onChange={set('heroSubheadline')} placeholder="Best prices in Pakistan"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/60 transition" />
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
        <h2 className="font-black text-white text-sm uppercase tracking-widest text-gray-400">About Section</h2>
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5">Title</label>
          <input value={form.aboutTitle} onChange={set('aboutTitle')} placeholder="About Us"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/60 transition" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5">Description</label>
          <textarea value={form.aboutBody} onChange={set('aboutBody')} rows={3}
            placeholder="Apne store ke baare mein likhein..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/60 transition resize-none" />
        </div>
      </section>

      {/* Theme Picker */}
      <section className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
        <h2 className="font-black text-white text-sm uppercase tracking-widest text-gray-400">Theme Color</h2>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {THEMES.map(t => (
            <button key={t.value} onClick={() => setForm(f => ({ ...f, theme: t.value }))}
              className={`relative flex flex-col items-center gap-2 p-2.5 rounded-xl border transition
                ${form.theme === t.value ? 'border-white bg-white/10' : 'border-white/10 hover:border-white/30'}`}>
              <div className="w-8 h-8 rounded-full shadow-lg shrink-0"
                style={{ background: `linear-gradient(135deg, ${t.bg}, ${t.dark})` }} />
              <span className="text-[10px] font-semibold text-gray-400 leading-none text-center">{t.label}</span>
              {form.theme === t.value && (
                <Check className="absolute top-1 right-1 w-3 h-3 text-white" />
              )}
            </button>
          ))}
        </div>

        {/* Live preview */}
        <div className="rounded-xl overflow-hidden border border-white/10 mt-2">
          <div className="h-2" style={{ background: currentTheme.bg }} />
          <div className="bg-white/5 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-white text-xs">{form.name || 'My Store'}</span>
              <div className="w-14 h-5 rounded-lg text-[9px] font-bold flex items-center justify-center text-white"
                style={{ background: currentTheme.bg }}>
                Cart
              </div>
            </div>
            <div className="h-12 rounded-lg flex items-center justify-center text-xs text-gray-500"
              style={{ background: `${currentTheme.bg}22` }}>
              Hero Section
            </div>
          </div>
        </div>
      </section>

      {/* Save */}
      <button onClick={handleSave} disabled={saving}
        className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-black py-3.5 rounded-xl transition text-sm flex items-center justify-center gap-2">
        {saving ? 'Saving...' : saved ? <><Check className="w-4 h-4" /> Saved!</> : 'Store Update Karein'}
      </button>
    </div>
  );
}
