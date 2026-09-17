/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#06070a',
          900: '#0a0c11',
          850: '#0e1016',
          800: '#12151c',
          750: '#171b24',
          700: '#1d222c',
          600: '#282e3a',
        },
        cyan: {
          glow: '#22d3ee',
        },
        violet: {
          glow: '#a78bfa',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'monospace',
        ],
      },
      letterSpacing: {
        widest2: '0.22em',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(34, 211, 238, 0.35)' },
          '70%': { boxShadow: '0 0 0 12px rgba(34, 211, 238, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(34, 211, 238, 0)' },
        },
        'sheen': {
          '0%': { transform: 'translateX(-110%)' },
          '100%': { transform: 'translateX(210%)' },
        },
        'flow-down': {
          '0%': { transform: 'translateY(-140%)', opacity: '0' },
          '25%': { opacity: '1' },
          '75%': { opacity: '1' },
          '100%': { transform: 'translateY(240%)', opacity: '0' },
        },
        'flow-right': {
          '0%': { transform: 'translateX(-140%)', opacity: '0' },
          '25%': { opacity: '1' },
          '75%': { opacity: '1' },
          '100%': { transform: 'translateX(240%)', opacity: '0' },
        },
        'drift': {
          '0%,100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,-14px,0)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fade-in 0.5s ease-out both',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4,0,0.6,1) infinite',
        sheen: 'sheen 2.6s ease-in-out infinite',
        'flow-down': 'flow-down 2.6s linear infinite',
        'flow-right': 'flow-right 2.6s linear infinite',
        drift: 'drift 7s ease-in-out infinite',
        'spin-slow': 'spin-slow 9s linear infinite',
      },
    },
  },
  plugins: [],
};
