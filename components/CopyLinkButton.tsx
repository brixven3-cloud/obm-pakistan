'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    // Build full URL if relative path given
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
    } catch {
      const el = document.createElement('input');
      el.value = fullUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button onClick={copy}
      className={`w-9 h-9 rounded-lg flex items-center justify-center transition ${copied ? 'bg-green-600/30' : 'bg-white/10 hover:bg-white/20'}`}
      title={copied ? 'Copied!' : 'Link copy karein'}>
      {copied
        ? <Check className="w-4 h-4 text-green-400" />
        : <Copy  className="w-4 h-4 text-gray-300" />}
    </button>
  );
}
