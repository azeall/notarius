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
        navy: '#ffffff',
        'navy-dark': '#e8f5f0',
        'navy-darker': '#def0e8',
        'navy-card': '#ffffff',
        'navy-card-2': '#f4faf8',
        gold: '#1D9E75',
        'gold-light': '#27b585',
        cream: '#2c2c2c',
        slate: '#5d6e67',
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
