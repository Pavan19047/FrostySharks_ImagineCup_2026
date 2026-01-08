/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        grotesk: ['Space Grotesk', 'sans-serif']
      },
      colors: {
        primary: '#7ae7c7',
        secondary: '#7dc4ff'
      }
    }
  },
  plugins: []
};
