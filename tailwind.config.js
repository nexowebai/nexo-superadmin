/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--text-secondary)',
        muted: 'var(--text-muted)',
        base: 'var(--border-base)',

        surface: {
          DEFAULT: 'var(--bg-surface)',
          base: 'var(--bg-base)',
          elevated: 'var(--bg-elevated)',
          subtle: 'var(--bg-subtle)',
        },

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
        },

        chart: {
          label: 'var(--chart-label)',
          'ring-background': 'var(--chart-ring-background)',
          'marker-foreground': 'var(--chart-marker-foreground)',
          'marker-border': 'var(--chart-marker-border)',
          'marker-background': 'var(--chart-marker-background)',
          'tooltip-muted': 'var(--chart-tooltip-muted)',
          'tooltip-foreground': 'var(--chart-tooltip-foreground)',
          'tooltip-background': 'var(--chart-tooltip-background)',
          grid: 'var(--chart-grid)',
          crosshair: 'var(--chart-crosshair)',
          'line-secondary': 'var(--chart-line-secondary)',
          'line-primary': 'var(--chart-line-primary)',
          'foreground-muted': 'var(--chart-foreground-muted)',
          foreground: 'var(--chart-foreground)',
          background: 'var(--chart-background)',
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
