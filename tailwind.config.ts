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
      // Имена классов оставлены прежними (navy/gold/cream/slate): их сотни в
      // вёрстке, и переименование ради красоты названия ничего бы не дало.
      // Значения теперь ведут на токены новой палитры — бумага и графит.
      colors: {
        navy: 'rgb(var(--bg-rgb) / <alpha-value>)',
        'navy-dark': 'rgb(var(--surface-2-rgb) / <alpha-value>)',
        'navy-darker': 'rgb(var(--surface-5-rgb) / <alpha-value>)',
        'navy-card': 'rgb(var(--surface-rgb) / <alpha-value>)',
        'navy-card-2': 'rgb(var(--surface-3-rgb) / <alpha-value>)',
        gold: 'rgb(var(--violet-rgb) / <alpha-value>)',
        'gold-light': 'rgb(var(--accent-2-rgb) / <alpha-value>)',
        cream: 'rgb(var(--text-rgb) / <alpha-value>)',
        slate: 'rgb(var(--muted-rgb) / <alpha-value>)',
        offwhite: 'rgb(var(--surface-3-rgb) / <alpha-value>)',
        rule: 'rgb(var(--hair-rgb) / <alpha-value>)',
        // Функциональный акцент «проверено / успех» — приглушённый мох
        emerald: 'rgb(var(--ok-rgb) / <alpha-value>)',
        'emerald-light': 'rgb(var(--ok-2-rgb) / <alpha-value>)',
      },
      fontFamily: {
        serif: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
