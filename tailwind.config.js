/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'oshi-pink': {
          50: '#fef7ff',
          100: '#feeefe',
          200: '#fce4fc',
          300: '#f9caf8',
          400: '#f4a3f1',
          500: '#ec68e8',
          600: '#d946df',
          700: '#be2eb8',
          800: '#9c2a95',
          900: '#7e2777',
        },
        'oshi-purple': {
          50: '#faf8ff',
          100: '#f3f0ff',
          200: '#e9e5ff',
          300: '#d4cdff',
          400: '#b8a8ff',
          500: '#9d7bff',
          600: '#8651ff',
          700: '#7433ff',
          800: '#632ce6',
          900: '#5228b8',
        }
      },
      animation: {
        'bounce-soft': 'bounce 1s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(236, 104, 232, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(236, 104, 232, 0.8)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        'japanese': ['Hiragino Sans', 'Yu Gothic', 'Meiryo', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};