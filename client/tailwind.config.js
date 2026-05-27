/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        iron: '#e05252',
        emerald: '#2dd4a0',
        frost: '#5b9bd5',
        gold: '#f5a623',
        realm: {
          bg: '#0d1117',
          surface: '#131a26',
          border: '#1e2d40',
          text: '#e8dcc8',
          muted: '#6b7a8d',
          frame: '#2a3a52',
          compass: '#c9a96e',
        }
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        mono: ['Courier Prime', 'monospace'],
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}