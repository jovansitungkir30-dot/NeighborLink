/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          50: '#EFF4FF',
          100: '#DCE6FE',
          200: '#BFD1FE',
          300: '#93B3FD',
          400: '#608BFA',
          500: '#3B67F5',
          600: '#2563EB',
          700: '#1D4CC7',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        secondary: {
          DEFAULT: '#14B8A6',
          50: '#EFFDFA',
          100: '#CCFBF1',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
        },
        accent: {
          DEFAULT: '#22C55E',
          50: '#F0FDF4',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
        },
        warning: {
          DEFAULT: '#F59E0B',
          400: '#FBBF24',
          500: '#F59E0B',
        },
        bg: {
          DEFAULT: '#F8FAFC',
          dark: '#0F172A',
        },
        ink: '#111827',
        glass: 'rgba(255,255,255,0.65)',
      },
      fontFamily: {
        heading: ['Poppins', 'Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'aurora-1': 'radial-gradient(circle at 20% 20%, rgba(37,99,235,0.35), transparent 55%)',
        'aurora-2': 'radial-gradient(circle at 80% 30%, rgba(20,184,166,0.30), transparent 55%)',
        'aurora-3': 'radial-gradient(circle at 50% 80%, rgba(34,197,94,0.28), transparent 55%)',
        'noise': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
      },
      animation: {
        'aurora-drift': 'auroraDrift 22s ease-in-out infinite alternate',
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'float-slower': 'floatSlow 14s ease-in-out infinite',
        'blob': 'blob 18s ease-in-out infinite',
        'spin-slow': 'spin 14s linear infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
      },
      keyframes: {
        auroraDrift: {
          '0%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(-3%, 2%, 0) scale(1.08)' },
          '100%': { transform: 'translate3d(3%, -2%, 0) scale(1.03)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-18px) rotate(3deg)' },
        },
        blob: {
          '0%, 100%': { borderRadius: '42% 58% 65% 35% / 45% 45% 55% 55%', transform: 'rotate(0deg)' },
          '33%': { borderRadius: '65% 35% 45% 55% / 35% 65% 35% 65%', transform: 'rotate(6deg)' },
          '66%': { borderRadius: '35% 65% 55% 45% / 60% 40% 60% 40%', transform: 'rotate(-6deg)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '0.55' },
          '100%': { transform: 'scale(1)', opacity: '0' },
        },
      },
      boxShadow: {
        glow: '0 0 60px -12px rgba(37,99,235,0.45)',
        'glow-teal': '0 0 60px -12px rgba(20,184,166,0.45)',
        'glow-green': '0 0 60px -12px rgba(34,197,94,0.45)',
        soft: '0 8px 40px -12px rgba(15,23,42,0.15)',
      },
    },
  },
  plugins: [],
}
