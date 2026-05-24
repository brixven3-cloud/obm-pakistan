'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm]       = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:     form.name,
        email:    form.email,
        phone:    form.phone,
        password: form.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Registration failed');
      setLoading(false);
      return;
    }

    // Auto login after register
    await signIn('credentials', {
      email:    form.email,
      password: form.password,
      redirect: false,
    });

    router.push('/dashboard');
    router.refresh();
  }

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <h1 className="text-2xl font-black text-white mb-1">Store banayein</h1>
        <p className="text-gray-500 text-sm mb-6">Sirf Rs 1000/month mein apna online store shuru karein</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Full Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={set('name')}
              placeholder="Ali Ahmed"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/60 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={set('email')}
              placeholder="ali@example.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/60 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Phone (optional)</label>
            <input
              type="tel"
              value={form.phone}
              onChange={set('phone')}
              placeholder="+92300xxxxxxx"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/60 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={set('password')}
              placeholder="Min 6 characters"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/60 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Confirm Password</label>
            <input
              type="password"
              required
              value={form.confirm}
              onChange={set('confirm')}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/60 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-3 rounded-xl transition text-sm mt-2"
          >
            {loading ? 'Account ban raha hai...' : 'Account Banayein'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already account hai?{' '}
          <Link href="/login" className="text-green-400 font-semibold hover:text-green-300 transition">
            Log in karein
          </Link>
        </p>
      </div>
    </div>
  );
}
