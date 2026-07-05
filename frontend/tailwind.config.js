/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ─── Typography ─────────────────────────────────────────
      fontFamily: {
        // Primary: Poppins (Sprint 1 addition)
        sans: ['Poppins', 'Inter', 'sans-serif'],
        // Keep existing utilities valid
        display: ['Poppins', 'Syne', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },

      // ─── Colors ──────────────────────────────────────────────
      colors: {
        // ── Existing brand (orange) — PRESERVED for backward compat ──
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

        // ── Primary: Emerald (Sprint 1 design system) ──────────
        primary: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },

        // ── Secondary: Mint ──────────────────────────────────────
        secondary: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },

        // ── Neutral: Slate (already in Tailwind, aliased) ────────
        neutral: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },

      // ─── Border Radius ───────────────────────────────────────
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },

      // ─── Box Shadows ─────────────────────────────────────────
      boxShadow: {
        // Existing — PRESERVED
        'card':       '0 4px 24px -4px rgba(0,0,0,0.08)',
        'card-hover': '0 20px 60px -12px rgba(0,0,0,0.15)',
        'orange':     '0 8px 25px -5px rgba(249,115,22,0.4)',
        'orange-lg':  '0 16px 40px -8px rgba(249,115,22,0.45)',
        'green':      '0 8px 25px -5px rgba(16,185,129,0.35)',
        'glow':       '0 0 40px rgba(249,115,22,0.15)',
        // New — Emerald / Mint variants
        'primary':    '0 8px 25px -5px rgba(16,185,129,0.35)',
        'primary-lg': '0 16px 40px -8px rgba(16,185,129,0.4)',
        'emerald':    '0 8px 25px -5px rgba(16,185,129,0.35)',
        'emerald-lg': '0 16px 40px -8px rgba(16,185,129,0.4)',
        'mint':       '0 8px 25px -5px rgba(34,197,94,0.3)',
        // UI component shadows
        'modal':      '0 25px 80px -12px rgba(0,0,0,0.25)',
        'dropdown':   '0 10px 40px -8px rgba(0,0,0,0.12)',
        'tooltip':    '0 4px 16px -4px rgba(0,0,0,0.15)',
        'input-focus':'0 0 0 3px rgba(16,185,129,0.15)',
        'sm':         '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
      },

      // ─── Animations ──────────────────────────────────────────
      animation: {
        // Existing — PRESERVED
        fadeUp:   'fadeUp 0.6s ease forwards',
        fadeIn:   'fadeIn 0.4s ease forwards',
        scaleIn:  'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        float:    'float 3s ease-in-out infinite',
        shimmer:  'shimmer 2s linear infinite',
        // New
        fadeDown: 'fadeDown 0.4s ease forwards',
        slideUp:  'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        slideLeft:'slideLeft 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'spin-slow': 'spin 2s linear infinite',
        pulse:    'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },

      // ─── Background Images ───────────────────────────────────
      backgroundImage: {
        // Existing — PRESERVED
        'gradient-hero':   'linear-gradient(135deg, #fff7ed 0%, #fef3c7 50%, #ecfdf5 100%)',
        'gradient-orange': 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
        'gradient-dark':   'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        'gradient-card':   'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.6))',
        // New
        'gradient-primary':  'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'gradient-emerald':  'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'gradient-mint':     'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        'gradient-hero-emerald': 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #f0fdf4 100%)',
        'shimmer': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
      },

      // ─── Spacing ─────────────────────────────────────────────
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
      },

      // ─── Typography Scale ────────────────────────────────────
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },

      // ─── Transitions ─────────────────────────────────────────
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
        '400': '400ms',
      },

      // ─── Z-Index ─────────────────────────────────────────────
      zIndex: {
        '60':  '60',
        '70':  '70',
        '80':  '80',
        '90':  '90',
        '100': '100',
      },
    },
  },
  plugins: [],
}
