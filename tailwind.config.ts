import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#f5ede0',
        'navy-dark': '#efe4d1',
        'navy-darker': '#e9dcc6',
        'navy-card': '#fdf8ef',
        'navy-card-2': '#f9f2e4',
        gold: '#c05c2e',
        'gold-light': '#d4763f',
        cream: '#3d2010',
        slate: '#7d6a55',
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
