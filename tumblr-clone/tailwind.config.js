/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          base: '#1a1a1a',
          lighter: '#252525',
          border: '#2f2f2f',
          hover: '#363636'
        }
      },
      aspectRatio: {
        'square': '1',
        'photo': '4/3',
      },
      gridTemplateColumns: {
        'gallery-2': 'repeat(2, minmax(0, 1fr))',
        'gallery-3': 'repeat(3, minmax(0, 1fr))',
      },
      gridTemplateRows: {
        'gallery': 'repeat(2, minmax(0, 1fr))',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-in-out forwards'
      }
    },
  },
  plugins: [],
}