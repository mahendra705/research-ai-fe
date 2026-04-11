/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'display': ['"Playfair Display"', 'Georgia', 'serif'],
        'body': ['"DM Sans"', 'system-ui', 'sans-serif'],
        'mono': ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: {
          50:  '#f7f6f3',
          100: '#eeece6',
          200: '#ddd9cf',
          300: '#c5bfb0',
          400: '#a89e8c',
          500: '#93876f',
          600: '#857762',
          700: '#6f6252',
          800: '#5c5146',
          900: '#4c443c',
          950: '#28231e',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-up': 'fadeUp 0.6s ease forwards',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        }
      },
      typography: (theme) => ({
        invert: {
          css: {
            '--tw-prose-body': theme('colors.ink[200]'),
            '--tw-prose-headings': theme('colors.ink[50]'),
            '--tw-prose-lead': theme('colors.ink[300]'),
            '--tw-prose-links': theme('colors.amber[400]'),
            '--tw-prose-bold': theme('colors.ink[100]'),
            '--tw-prose-counters': theme('colors.ink[400]'),
            '--tw-prose-bullets': theme('colors.ink[500]'),
            '--tw-prose-hr': theme('colors.ink[700]'),
            '--tw-prose-quotes': theme('colors.ink[100]'),
            '--tw-prose-quote-borders': theme('colors.amber[500]'),
            '--tw-prose-code': theme('colors.amber[400]'),
            '--tw-prose-pre-code': theme('colors.ink[200]'),
            '--tw-prose-pre-bg': theme('colors.ink[950]'),
            '--tw-prose-th-borders': theme('colors.ink[600]'),
            '--tw-prose-td-borders': theme('colors.ink[700]'),
          },
        },
      }),
    },
  },
  plugins: [],
}
