/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'var(--ds-brand-50)',
          100: 'var(--ds-brand-100)',
          200: 'var(--ds-brand-200)',
          300: 'var(--ds-brand-300)',
          400: 'var(--ds-brand-400)',
          500: 'var(--ds-brand-500)',
          600: 'var(--ds-brand-600)',
          700: 'var(--ds-brand-700)',
          800: 'var(--ds-brand-800)',
          900: 'var(--ds-brand-900)',
        }
      },
      spacing: {
        'ds-1': 'var(--ds-space-1)',
        'ds-2': 'var(--ds-space-2)',
        'ds-3': 'var(--ds-space-3)',
        'ds-4': 'var(--ds-space-4)',
        'ds-6': 'var(--ds-space-6)',
        'ds-8': 'var(--ds-space-8)',
        'ds-10': 'var(--ds-space-10)',
        'ds-12': 'var(--ds-space-12)',
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }
}
