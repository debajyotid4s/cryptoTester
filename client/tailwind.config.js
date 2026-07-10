/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        realm: {
          bg: '#0d1117',
          surface: '#131a26',
          border: '#1e2d40',
          text: '#e8dcc8',
          muted: '#6b7a8d',
        }
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        mono: ['Courier Prime', 'monospace'],
      },
    },
  },
}