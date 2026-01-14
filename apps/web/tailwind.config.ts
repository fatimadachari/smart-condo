import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        clay: {
          50: '#FAF7F5',
          100: '#F5EBE6',
          200: '#EBD5C8',
          300: '#D6B09C',
          400: '#BF8B72',
          500: '#A66E53',
          600: '#8C523A',
          700: '#733D29',
          800: '#5C3022',
          900: '#452219',
        },
        stone: {
          50: '#FAF9F8',
          100: '#F5F2F0',
          200: '#EBE8E4',
          300: '#DCD8D3',
          400: '#BDB9B4',
          500: '#9E9A94',
          600: '#75726D',
          700: '#52504C',
          800: '#3D3B38',
          900: '#292826',
        },
        espresso: {
          500: '#4A403A',
          600: '#38302C',
          800: '#26201D',
          900: '#1A1614',
        },
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 40px -2px rgba(166, 110, 83, 0.08)',
        'inner-light': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #F5EBE6 0%, #FAF9F8 100%)',
      }
    },
  },
  plugins: [],
};
export default config;