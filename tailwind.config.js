/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'charcoal': '#36454F',
        'custom-dark': '#0C0C0C',
      },
    },
  },
  plugins: [],
}

