/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#02030a',
          800: '#060812',
          700: '#0a0d1c',
          600: '#0f1224',
          500: '#141525',
        },
        plasma: {
          300: '#7df0ff',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0284a8',
        },
        flux: {
          300: '#ffd466',
          400: '#f5b041',
          500: '#d98e1a',
          600: '#8a5a10',
        },
        aurora: {
          300: '#6dffb5',
          400: '#14f195',
          500: '#0bb774',
        },
        ember: {
          300: '#ff7a6b',
          400: '#ef4444',
          500: '#b91c1c',
        },
        violet: {
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#7c3aed',
          600: '#5b21b6',
        },
        rose: {
          300: '#fda4c3',
          400: '#f43f5e',
          500: '#be123c',
        },
        console: {
          bg:        '#02030a',   // true ink
          panel:     '#0a0d1c',
          dim:       '#060812',
          elev:      '#0f1224',
          border:    '#1a1f33',
          borderHot: '#2a3350',
          accent:    '#06b6d4',
          glow:      '#22d3ee',
          amber:     '#f5b041',
          live:      '#14f195',
          alert:     '#ef4444',
          text:      '#c6d8ea',
          muted:     '#7891a8',
          faint:     '#4a5a70',
        },
      },
      boxShadow: {
        'elev-1': '0 1px 0 rgba(255,255,255,0.03), 0 1px 2px rgba(0,0,0,0.6)',
        'elev-2': '0 1px 0 rgba(255,255,255,0.03), 0 2px 6px rgba(0,0,0,0.7)',
        'elev-3': '0 1px 0 rgba(255,255,255,0.04), 0 6px 14px rgba(0,0,0,0.75)',
        'elev-4': '0 1px 0 rgba(255,255,255,0.04), 0 12px 28px rgba(0,0,0,0.8)',
        'elev-5': '0 2px 0 rgba(255,255,255,0.05), 0 22px 44px rgba(0,0,0,0.85)',
        'elev-6': '0 2px 0 rgba(255,255,255,0.06), 0 36px 72px rgba(0,0,0,0.9)',
        'inner-hi': 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.55)',
        'inner-lo': 'inset 0 1px 2px rgba(0,0,0,0.7), inset 0 -1px 0 rgba(255,255,255,0.03)',
      },
      fontFamily: {
        mono: ['Courier New', 'Courier', 'monospace'],
        display: ['Courier New', 'monospace'],
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '92%': { opacity: '1' },
          '93%': { opacity: '0.8' },
          '94%': { opacity: '1' },
          '96%': { opacity: '0.9' },
          '97%': { opacity: '1' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        typewriter: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        pulse_slow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
      animation: {
        scanline: 'scanline 8s linear infinite',
        flicker: 'flicker 4s infinite',
        glitch: 'glitch 0.3s ease infinite',
        fadeIn: 'fadeIn 0.6s ease forwards',
        pulse_slow: 'pulse_slow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
