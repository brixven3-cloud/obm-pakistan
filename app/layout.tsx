import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'OBM Pakistan — Online Business Market',
  description:
    'Launch your online store in minutes. Share your link on WhatsApp, Instagram, or Facebook and start receiving orders today.',
  keywords: 'online store pakistan, whatsapp shop, ecommerce pakistan, obm pakistan',
  openGraph: {
    title: 'OBM Pakistan — Online Business Market',
    description: 'Launch your online store in minutes.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-black text-white min-h-screen">{children}</body>
    </html>
  );
}
