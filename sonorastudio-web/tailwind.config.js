/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          900: '#0a0a0a',   // Fondo principal ultra oscuro
          800: '#171717',   // Paneles y tarjetas (glassmorphism base)
          700: '#262626',   // Bordes sutiles y divisores
          metal: '#a1a1aa', // Texto secundario y acentos metálicos
          accent: '#3b82f6',// Color de impacto para botones primarios
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // Tipografía limpia y geométrica
      }
    },
  },
  plugins: [],
}