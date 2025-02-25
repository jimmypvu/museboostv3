/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./components/**/*.{html,js}",
    "./script.js",
    "./styles/**/*.css",
    "./articles/**/*.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Mona Sans", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        brand: ["Dancing Script", "cursive"]
      },
      colors: {
        'museboost-primary': '#FF4D8D',
        'museboost-secondary': '#8C54FF',
        'museboost-accent': '#22D3EE',
        'dark-bg': '#0a0a0a',
        'darker-bg': '#050505',
        'cream-white': '#FAF9F6'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.7s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}
