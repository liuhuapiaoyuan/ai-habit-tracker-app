import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        foreground: 'var(--foreground-rgb)',
        primary: {
          DEFAULT: 'var(--primary)',
          50: 'var(--primary-alpha-50)',
          100: 'var(--primary-alpha-100)',
          200: 'var(--primary-alpha-200)',
          300: 'var(--primary-alpha-300)',
          400: 'var(--primary-alpha-400)',
          500: 'var(--primary-alpha-500)',
          600: 'var(--primary-alpha-600)',
          700: 'var(--primary-alpha-700)',
          800: 'var(--primary-alpha-800)',
          900: 'var(--primary-alpha-900)',
        },
        'primary-dark': 'var(--primary-dark)',
        secondary: 'var(--secondary)',
        'secondary-dark': 'var(--secondary-dark)',
      },
    },
  },
  plugins: [],
} satisfies Config;
