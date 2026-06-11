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
        navy: '#f4f3fd',
        'navy-dark': '#eceafb',
        'navy-darker': '#e4e1f7',
        'navy-card': '#ffffff',
        'navy-card-2': '#f8f7fe',
        gold: '#534AB7',
        'gold-light': '#6f66d6',
        cream: '#26223d',
        slate: '#75718f',
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
