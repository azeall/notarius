import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: 'rgb(var(--bg-rgb) / <alpha-value>)',
        'navy-dark': 'rgb(var(--surface-2-rgb) / <alpha-value>)',
        'navy-darker': 'rgb(var(--surface-5-rgb) / <alpha-value>)',
        'navy-card': 'rgb(var(--surface-rgb) / <alpha-value>)',
        'navy-card-2': 'rgb(var(--surface-3-rgb) / <alpha-value>)',
        gold: 'rgb(var(--violet-rgb) / <alpha-value>)',
        'gold-light': '#d4763f',
        cream: 'rgb(var(--text-rgb) / <alpha-value>)',
        slate: 'rgb(var(--muted-rgb) / <alpha-value>)',
        offwhite: '#f5f5f5',
        // Функциональный акцент «проверено / успех» — приглушённый изумруд
        emerald: '#4f9d7a',
        'emerald-light': '#6fbf99',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
