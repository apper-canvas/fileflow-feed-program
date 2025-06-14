/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        secondary: '#4A4A4A',
        accent: '#0066FF',
        surface: '#F5F5F5',
        background: '#FFFFFF',
        success: '#00A651',
        warning: '#FFB800',
        error: '#D32F2F',
        info: '#0288D1'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Space Grotesk', 'ui-sans-serif', 'system-ui']
      },
      scale: {
        '98': '0.98'
      }
    },
  },
  plugins: [],
}