import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db';
import Store from '@/lib/models/Store';
import Product from '@/lib/models/Product';
import Category from '@/lib/models/Category';
import StoreClient from './StoreClient';
import Link from 'next/link';

export const revalidate = 60;

const THEMES: Record<string, { bg: string; dark: string }> = {
  green:    { bg: '#16a34a', dark: '#14532d' },
  blue:     { bg: '#2563eb', dark: '#1e3a8a' },
  darkGold: { bg: '#b45309', dark: '#78350f' },
  pink:     { bg: '#db2777', dark: '#9d174d' },
  teal:     { bg: '#0d9488', dark: '#134e4a' },
  coral:    { bg: '#e11d48', dark: '#881337' },
  purple:   { bg: '#7c3aed', dark: '#4c1d95' },
  orange:   { bg: '#ea580c', dark: '#7c2d12' },
  rose:     { bg: '#be185d', dark: '#831843' },
  slate:    { bg: '#475569', dark: '#1e293b' },
  white:    { bg: '#f8fafc', dark: '#cbd5e1' },
  black:    { bg: '#18181b', dark: '#09090b' },
};

export default async function StorePage({ params }: { params: { slug: string } }) {
  await connectDB();

  const storeRaw = await Store.findOne({ slug: params.slug }).lean();
  if (!storeRaw) notFound();

  const theme = THEMES[storeRaw.theme] ?? THEMES.green;

  // Store paused
  if (!storeRaw.isActive) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-3xl"
          style={{ background: theme.dark }}>
          🔒
        </div>
        <h1 className="text-2xl font-black text-white mb-2">{storeRaw.name}</h1>
        <p className="text-gray-400 text-sm max-w-xs mb-6">
          Ye store abhi available nahi hai. Thodi der baad dobara try karein.
        </p>
        <Link href="/" className="text-xs text-gray-600 hover:text-gray-400 transition">
          Powered by OBM Pakistan
        </Link>
      </div>
    );
  }

  const [productsRaw, categoriesRaw] = await Promise.all([
    Product.find({ storeId: storeRaw._id }).sort({ createdAt: -1 }).lean(),
    Category.find({ storeId: storeRaw._id }).lean(),
  ]);

  // Serialize for client component
  const store   = JSON.parse(JSON.stringify(storeRaw));
  const products = JSON.parse(JSON.stringify(productsRaw));
  const categories = JSON.parse(JSON.stringify(categoriesRaw));

  return <StoreClient store={store} products={products} categories={categories} theme={theme} />;
}
