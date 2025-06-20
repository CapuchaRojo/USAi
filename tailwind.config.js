/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        steel: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#0a0f1d', // Machine-polished steel base
        },
        'neon-pink': '#ec4899', // Command signals
        'neon-blue': '#3b82f6', // Telemetry pulses
        'electric-blue': '#60a5fa', // Insight pulses
      },
      fontFamily: {
        display: ['Rajdhani', 'sans-serif'], // Military-style
        mono: ['Source Code Pro', 'monospace'], // Terminal text
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'signal-pulse': 'signalPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        signalPulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        }
      }
    },
  },
  plugins: [],
}