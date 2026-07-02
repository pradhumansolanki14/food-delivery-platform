/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'card': '0 4px 24px -4px rgba(0,0,0,0.08)',
        'card-hover': '0 20px 60px -12px rgba(0,0,0,0.15)',
        'orange': '0 8px 25px -5px rgba(249,115,22,0.4)',
        'orange-lg': '0 16px 40px -8px rgba(249,115,22,0.45)',
        'green': '0 8px 25px -5px rgba(16,185,129,0.35)',
        'glow': '0 0 40px rgba(249,115,22,0.15)',
      },
      animation: {
        fadeUp: 'fadeUp 0.6s ease forwards',
        fadeIn: 'fadeIn 0.4s ease forwards',
        scaleIn: 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        float: 'float 3s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #fff7ed 0%, #fef3c7 50%, #ecfdf5 100%)',
        'gradient-orange': 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.6))',
      },
    },
  },
  plugins: [],
}
