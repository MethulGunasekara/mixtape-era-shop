import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-cream': '#F3EFDE',
        'brand-red': '#EB7A65',
        'brand-yellow': '#F6CC65',
        'brand-green': '#538D66',
        'brand-black': '#0F0F0F',
      },
      fontFamily: {
        'display': ['var(--font-display)', 'sans-serif'],
        'mono': ['var(--font-mono)', 'monospace'],
      },
      boxShadow: {
        'button': '4px 4px 0px 0px #0F0F0F',
        'button-hover': '2px 2px 0px 0px #0F0F0F',
      },
      // --- ANIMATIONS ---
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
      },
    },
  },
  plugins: [],
};
export default config;