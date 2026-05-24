import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        brand: 'var(--brand)',
        'brand-dark': 'var(--brand-dark)',
        accent: 'var(--accent)',
        'theme-bg': 'var(--bg)',
        'theme-text': 'var(--text)',
        'theme-card': 'var(--card)',
        'theme-border': 'var(--border)',
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'Helvetica', 'sans-serif'],
      },
      screens: {
        xs: '360px', // mobile-first baseline
      },
    },
  },
  plugins: [],
};

export default config;
