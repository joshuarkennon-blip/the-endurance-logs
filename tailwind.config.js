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
        console: {
          bg: '#030508',
          panel: '#060d14',
          border: 'rgba(0, 245, 255, 0.22)',
          dim: '#0a1218',
          accent: '#00c8e8',
          glow: '#00f5ff',
          amber: '#ffb020',
          text: '#c8f4ff',
          muted: '#5a8a9e',
        }
      },
      fontFamily: {
        mono: ['IBM Plex Mono', 'Share Tech Mono', 'Courier New', 'Courier', 'monospace'],
        display: ['IBM Plex Mono', 'Share Tech Mono', 'Courier New', 'monospace'],
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
        }
      },
      animation: {
        scanline: 'scanline 8s linear infinite',
        flicker: 'flicker 4s infinite',
        glitch: 'glitch 0.3s ease infinite',
        fadeIn: 'fadeIn 0.6s ease forwards',
        pulse_slow: 'pulse_slow 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
