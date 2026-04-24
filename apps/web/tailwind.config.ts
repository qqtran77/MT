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
        primary: {
          DEFAULT: '#1a3a5c',
          50: '#e8eef5',
          100: '#c5d5e8',
          200: '#9eb9d8',
          300: '#779dc8',
          400: '#5a88bb',
          500: '#3d73ae',
          600: '#2e6099',
          700: '#1a3a5c',
          800: '#142d48',
          900: '#0d1f33',
        },
        secondary: {
          DEFAULT: '#2e75b6',
          50: '#e8f1f9',
          100: '#c5dbf0',
          200: '#9ec3e6',
          300: '#77abdc',
          400: '#5698d4',
          500: '#3585cb',
          600: '#2e75b6',
          700: '#24609a',
          800: '#1a4b7e',
          900: '#103562',
        },
        accent: '#f0a500',
        border: 'hsl(214.3 31.8% 91.4%)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #1a3a5c 0%, #2e75b6 50%, #1a3a5c 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
