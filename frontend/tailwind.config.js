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
          primary: '#003049', // Primary Dark Blue
          cream: '#EAE2B7',   // Soft Background Cream
          accent: '#FCBF49',  // Highlight / CTA Yellow
          red: '#D62828',     // Critical / Angry Red
          orange: '#F77F00',  // Sarcasm / Warning Orange
        },
        sentiment: {
          supportive: '#003049', // Mapping to Primary for now (Trust)
          critical: '#D62828',
          angry: '#D62828',
          sarcastic: '#F77F00',
          informative: '#219EBC', // Adding a complementary blue (from similar palette usually) or I can use opacity of Primary. 
                                  // Wait, I should strictly stick to palette if possible. 
                                  // But #003049 is very dark. 
                                  // Let's use #003049 for now.
          appreciative: '#FCBF49',
          neutral: '#6B7280', // keeping a gray for neutral
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