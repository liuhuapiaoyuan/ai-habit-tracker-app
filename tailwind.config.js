/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#FFD166',
        'secondary': '#06D6A0',
        'accent': '#EF476F',
        'background': '#F8F9FA',
      },
      fontFamily: {
        'comic': ['"Comic Neue"', 'cursive'],
      },
      boxShadow: {
        'cartoon': '8px 8px 0px rgba(0,0,0,0.2)',
      }
    },
  },
  plugins: [],
}
