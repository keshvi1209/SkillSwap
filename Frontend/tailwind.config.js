/** @type {import('tailwindcss').Config} */

// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'float': 'float 12s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 8s ease-in-out infinite',
        'rotate-slow': 'rotate 30s linear infinite',
        'move': 'move 18s ease-in-out infinite',
        'drift': 'drift 20s ease-in-out infinite alternate',
        'drift-reverse': 'drift 15s ease-in-out infinite alternate-reverse',
        'drift-delay': 'drift 18s ease-in-out infinite alternate 2s',
      },
    },
  },
  plugins: [],
}