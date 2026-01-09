import type { Config } from "tailwindcss";

const config: Config = {
  // AQUI ESTÁ A CORREÇÃO:
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",     // Caso você use a pasta 'src' (padrão Next.js novo)
    "./app/**/*.{js,ts,jsx,tsx,mdx}",     // Caso 'app' esteja na raiz
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Caso 'components' esteja na raiz
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",   // Apenas por segurança
  ],
  theme: {
    extend: {
      colors: {
        terracotta: {
          50: '#FDF8F3',
          100: '#FBEEE5',
          200: '#F6DBC9',
          300: '#F0C2A3',
          400: '#E8A375',
          500: '#C25E00',
          600: '#9E4D00',
          700: '#7A3B00',
          800: '#5C2D00',
          900: '#3D1E00',
        },
        gunmetal: {
          500: '#2C3338',
          600: '#1F2937',
          700: '#111827',
          900: '#0B0F19',
        },
        alabaster: '#F9F7F5',
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 4px 20px -2px rgba(194, 94, 0, 0.15)',
      }
    },
  },
  plugins: [],
};
export default config;