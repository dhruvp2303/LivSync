/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#5B5BFF',
        secondary: '#8B5CF6',
        success: '#22C55E',
        accent: '#F59E0B',
        error: '#EF4444',
        surface: '#FFFFFF',
        muted: '#647488',
        dark: '#0F172A',
      },
    },
  },
  plugins: [],
};
