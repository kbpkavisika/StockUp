/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
}

