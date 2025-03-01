/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        bounceColor: {
          '0%': { transform: 'translateY(0)', backgroundColor: '#10B981' },
          '10%': { transform: 'translateY(-30%)', backgroundColor: '#3B82F6' },
          '20%': { transform: 'translateY(0)', backgroundColor: '#F59E0B' },
          '30%': { transform: 'translateY(-30%)', backgroundColor: '#EF4444' },
          '40%': { transform: 'translateY(0)', backgroundColor: '#8B5CF6' },
          '50%': { transform: 'translateY(-30%)', backgroundColor: '#EC4899' },
          '60%': { transform: 'translateY(0)', backgroundColor: '#F97316' },
          '70%': { transform: 'translateY(-30%)', backgroundColor: '#22D3EE' },
          '80%': { transform: 'translateY(0)', backgroundColor: '#A3E635' },
          '90%': { transform: 'translateY(-30%)', backgroundColor: '#D946EF' },
          '100%': { transform: 'translateY(0)', backgroundColor: '#10B981' },
        },
        loadingBar: {
          '0%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        bounceColor: 'bounceColor 10s infinite',
        loadingBar: 'loadingBar 2s ease-in-out infinite',
      },
    },
    
  },
  plugins: [],
};
