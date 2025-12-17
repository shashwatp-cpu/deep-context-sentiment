/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: '#00A99D', // GiveWell Teal
          secondary: '#1A202C', // Dark heading text
          dark: '#2D3748', // Footer dark
          light: '#F7FAFC', // Section background off-white
          accent: '#00A99D', // Match primary for now
          // Keeping sentiment colors for functional parts of the app
          red: '#D62828',
          orange: '#F77F00',
        },
        sentiment: {
          supportive: '#00A99D',
          critical: '#D62828',
          angry: '#D62828',
          sarcastic: '#F77F00',
          appreciative: '#FCBF49',
          neutral: '#6B7280',
          informative: '#219EBC',
        }
      },
      animation: {
        'blob': 'blob 7s infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}