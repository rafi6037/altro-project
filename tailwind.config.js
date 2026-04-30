/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        green: {
          DEFAULT: '#1a5c38',
          mid: '#2a7d50',
          deep: '#0d3322',
        },
        lime: '#c9f230',
        cream: '#f5f2eb',
        ink: '#0e1a12',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}