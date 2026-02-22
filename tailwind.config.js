/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
       keyframes: {
        floatPopSpin: {
          '0%':   { transform: 'translateY(0px) rotate(0deg) scale(1)' },
          '15%':  { transform: 'translateY(-30px) rotate(5deg) scale(1.1)' },
          '30%':  { transform: 'translateY(20px) rotate(-5deg) scale(0.95)' },
          '50%':  { transform: 'translateY(-25px) rotate(3deg) scale(1.08)' },
          '70%':  { transform: 'translateY(15px) rotate(-3deg) scale(0.97)' },
          '85%':  { transform: 'translateY(-20px) rotate(2deg) scale(1.04)' },
          '100%': { transform: 'translateY(0px) rotate(0deg) scale(1)' },
        },
      },
      animation: {
        floatPopSpin: 'floatPopSpin 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}

